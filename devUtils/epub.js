var EPub = require('epub');
var path = require('path');
var htmlparser = require('htmlparser2');
var debug = require('debug')('scripture-lottery');
var parser;
var program = require('commander');
var fs = require('fs');

var works = ['ot', 'nt', 'jst', 'bofm', 'bd', 'tg'];

program
  .version('0.0.1')
  .option('-f, --file [path]', 'specify which epub to read. default 1', '1')
  .parse(process.argv);

var epub = new EPub(path.join(process.cwd(), program.file));

parser = new htmlparser.Parser({
  onopentag: function (tagname, attrs) {
    if (tagname === 'p' && attrs.class === 'verse' && attrs.id) {
      var parts = attrs.id.split('_');
      if (parts) {
        parser.lastSeen = parseInt(parts.pop());
      }
    }
  },
});

var accumulator = {};

epub.on("end", function(){
  // epub is now usable
  var work = null;

  console.log(epub.metadata.title);
  console.log(epub.metadata);
  var chapters = [];

  epub.flow.forEach(function(chapter){
    var id = chapter.id;
    var parts = id.split('_');
    var book = parts[1];
    var chapterNum = parseInt(parts[2]);

    if (parts.length === 3 && chapterNum === 0 && works.indexOf(parts[1]) !== -1) {
      work = parts[1];
    }

    if (chapterNum > 0) {
      chapters.push({id: id, book: book, num: chapterNum, work: work});
    } else  if (work === 'tg' || work === 'bd' || work === 'jst') {
      // silently ignore
    } else if (chapterNum === 0) {
      chapters.push({id: id, book: book, num: 1, work: work});
    } else {
      debug('Chapter id "%s" isn\'t a normal chapter.', id);
    }
  });

  function processChapter() {
    if (chapters.length === 0) {
      debug('Done processing chapters');
      return;
    }

    var meta = chapters.shift();
    epub.getChapter(meta.id, function (err, text) {
      if (err) {
        debug('got err fetching chapter', err);
        return;
      }

      parser.write(text);
      if (parser.lastSeen > 0) {
        debug('Found work %s book %s has chapter %d with last verse %d', meta.work, meta.book, meta.num, parser.lastSeen);

        accumulator[meta.work] = accumulator[meta.work] || {};
        accumulator[meta.work][meta.book] = accumulator[meta.work][meta.book] || [];
        accumulator[meta.work][meta.book][meta.num - 1] = parseInt(parser.lastSeen);

        fs.writeFileSync(path.join(__dirname, 'output/verses.json'), JSON.stringify(accumulator, null, 2));
      }
      parser.lastSeen = -1;

      processChapter();
    });
  }

  processChapter();
});

epub.parse();
