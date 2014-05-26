var EPub = require('epub');
var path = require('path');
var epub = new EPub(path.join(__dirname, '../epubs/book-of-mormon-eng.epub'));
var htmlparser = require('htmlparser2');
var debug = require('debug')('scripture-lottery');
var parser;

epub.on("end", function(){
  // epub is now usable
  console.log(epub.metadata.title);

  epub.flow.forEach(function(chapter){
    var id = chapter.id;
    var parts = id.split('_');
    var book = parts[1];
    var chapterNum = parseInt(parts[2]);

    if (chapterNum > 0) {
      debug("Found booK '%s' chapter %d", book, chapterNum);
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
