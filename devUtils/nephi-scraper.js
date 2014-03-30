var request = require('superagent'),
    htmlparser = require('htmlparser2'),
    parser;

(function () {
  var inPar = false,
      versePattern = /^(\d+)\./,
      lastVerse = 1;

  parser = new htmlparser.Parser({
    // TODO parse the 'next' link as well.
    onopentag: function (tagname, attrs) {
      if (tagname === 'p') {
        inPar = true;
      }
      if (tagname === 'a' && attrs.accesskey === 'N') {
        console.log('found next link', attrs.href);
        parser.nextLink = attrs.href;
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
      console.log('parser returned lastverse(%s) nextlink(%s)', parser.lastVerse, parser.nextLink);
      // console.log(res.text);
    });
console.log('ran');
