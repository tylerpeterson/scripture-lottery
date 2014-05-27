var EPub = require('epub');
var path = require('path');
var epub = new EPub(path.join(__dirname, '../epubs/book-of-mormon-eng.epub'));
var htmlparser = require('htmlparser2');
var debug = require('debug')('scripture-lottery');
var parser;

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


epub.on("end", function(){
  // epub is now usable
  console.log(epub.metadata.title);

  epub.flow.forEach(function(chapter){
    var id = chapter.id;
    var parts = id.split('_');
    var book = parts[1];
    var chapterNum = parseInt(parts[2]);

    if (chapterNum > 0) {
      epub.getChapter(chapter.id, function (err, text) {
        if (err) {
          debug('got err fetching chapter', err);
          return;
        }

        parser.write(text);
        debug('Found book %s has chapter %d with last verse %d', book, chapterNum, parser.lastSeen);
      });
    } else {
      debug('Chapter id "%s" isn\'t a normal chapter.', id);
    }
  });

  epub.getChapter('lds_moro_010', function (err, text) {
    if (err) return console.log(err);
    console.log(text);
  });
});

epub.parse();
