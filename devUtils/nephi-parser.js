var htmlparser = require('htmlparser2'),
    debug = require('debug')('nephi-parser'),
    parser;

module.exports = function (markup) {
  var inPar = false,
      inH1 = false,
      versePattern = /^(\d+)\./,
      chapterPattern = /Chapter\s+(\d+)/i,
      chapter = 0;
      lastVerse = 1,
      nextLink = null,
      divClass = null,
      parser = new htmlparser.Parser({
    onopentag: function (tagname, attrs) {
      if (tagname === 'p') {
        inPar = true;
      }
      if (tagname === 'h1') {
        inH1 = true;
      }
      if (tagname === 'link' && attrs.rel === 'NEXT') {
        debug('found next link', attrs.href);
        nextLink = attrs.href;
      }
      if (tagname === 'div' && attrs.class) {
        debug('entered a div with class %s', attrs.class);
        divClass = attrs.class;
      }
    },
    ontext: function (text) {
      var matches;

      if (inPar && text) {
        matches = text.match(versePattern);
        if (matches) {
          lastVerse = matches[1];
          debug('found verse (%s)', lastVerse);
        }
      }
      if (inH1 && text && divClass === 'section') {
        debug('found text that might have the chapter: %s', text);
        matches = text.match(chapterPattern);
        if (matches) {
          chapter = matches[1];
          debug('found chapter (%s)', chapter);
        }
      }
    },
    onclosetag: function (tagname) {
      if (tagname === 'p') {
        inPar = false;
      }
      if (tagname === 'h1') {
        inH1 = false;
      }
    }
  });

  parser.write(markup);
  parser.end();

  debug('reached document end. last verse:', lastVerse);
  return {lastVerse: lastVerse, nextLink: nextLink, chapter: chapter};
};


