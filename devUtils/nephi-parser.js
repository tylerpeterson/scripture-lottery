var htmlparser = require('htmlparser2'),
    debug = require('debug')('nephi-parser'),
    parser;

module.exports = function (markup) {
  var inPar = false,
      versePattern = /^(\d+)\./,
      lastVerse = 1,
      nextLink = null,
      parser = new htmlparser.Parser({
    onopentag: function (tagname, attrs) {
      if (tagname === 'p') {
        inPar = true;
      }
      if (tagname === 'link' && attrs.rel === 'NEXT') {
        debug('found next link', attrs.href);
        nextLink = attrs.href;
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
      if (tagname === 'p') {
        inPar = false;
      }
    }
  });

  parser.write(markup);
  parser.end();

  debug('reached document end. last verse:', lastVerse);
  return {lastVerse: lastVerse, nextLink: nextLink};
};


