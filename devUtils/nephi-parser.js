var htmlparser = require('htmlparser2'),
    debug = require('debug')('nephi-parser'),
    parser;

(function () {
  var inPar = false,
      versePattern = /^(\d+)\./,
      lastVerse = 1;

  // TODO have a cleaner interface for returning the desired values
  parser = new htmlparser.Parser({
    onopentag: function (tagname, attrs) {
      if (tagname === 'p') {
        inPar = true;
      }
      if (tagname === 'link' && attrs.rel === 'NEXT') {
        debug('found next link', attrs.href);
        parser.nextLink = attrs.href;
      }
    },
    ontext: function (text) {
      var matches;

      if (inPar && text) {
        matches = text.match(versePattern);
        if (matches) {
          lastVerse = matches[1];
          debug('found verse', lastVerse);
        }
      }
    },
    onclosetag: function (tagname) {
      if (tagname === 'html') {
        debug('reached document end. last verse:', lastVerse);
        parser.lastVerse = lastVerse;
      }
      if (tagname === 'p') {
        inPar = false;
      }
    }
  });
})();

module.exports = parser;

