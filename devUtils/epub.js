var EPub = require('epub');
var path = require('path');
var epub = new EPub(path.join(__dirname, '../epubs/book-of-mormon-eng.epub'));

epub.on("end", function(){
  // epub is now usable
  console.log(epub.metadata.title);

  epub.flow.forEach(function(chapter){
      console.log(chapter.id);
  });

  epub.getChapter('lds_moro_010', function (err, text) {
    if (err) return console.log(err);
    console.log(text);
  });
});

epub.parse();
