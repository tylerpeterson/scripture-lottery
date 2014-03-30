var request = require('superagent'),
    htmlparser = require('htmlparser2'),
    parser;

(function () {
  var inPar = false,
      versePattern = /^(\d+)\./,
      lastVerse = 1;

  parser = new htmlparser.Parser({
    // TODO parse the 'next' link as well.
    onopentag: function (tagname) {
      if (tagname === 'p') {
        inPar = true;
      }
    },
    ontext: function (text) {
      var matches;

      if (inPar && text) {
        matches = text.match(versePattern);
        if (matches) {
          lastVerse = matches[1];
          console.log('found verse', lastVerse);
        }
      }
    },
    onclosetag: function (tagname) {
      if (tagname === 'html') {
        console.log('reached document end. last verse:', lastVerse);
        parser.lastVerse = lastVerse;
      }
      if (tagname === 'p') {
        inPar = false;
      }
    }
  });
})();

request.get('http://scriptures.nephi.org/docbook/bom/c6.html')
    .end(function (err, res) {
      parser.write(res.text);
      parser.end();
      console.log('parser returned', parser.lastVerse);
      // console.log(res.text);
    });
console.log('ran');
