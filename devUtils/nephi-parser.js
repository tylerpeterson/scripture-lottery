var htmlparser = require('htmlparser2'),
    debug = require('debug')('nephi-parser'),
    parser;

module.exports = function (markup) {
  var inPar = false,
      inH1 = false,
      inTitle = false,
      versePattern = /^(\d+)\./,
      chapterPattern = /Chapter\s+(\d+)/i,
      book = null,
      chapter = 0,
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
      if (tagname === 'link' && attrs.rel === 'UP') {
        book = attrs.title;
        debug('found the book name in up link (%s)', book);
      }
      if (tagname === 'div' && attrs.class) {
        debug('entered a div with class %s', attrs.class);
        divClass = attrs.class;
      }
      if (tagname === 'title') {
        debug('entered title');
        inTitle = true;
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
      if (inTitle && text) {
        matches = text.match(chapterPattern);
        if (matches) {
          chapter = matches[1];
          debug('found chapter (%s) in title');
        } else {
          book = text;
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
      if (tagname === 'title') {
        inTitle = false;
      }
    }
  });

  parser.write(markup);
  parser.end();

  debug('reached document end. last verse:', lastVerse);
  return {lastVerse: lastVerse, nextLink: nextLink, chapter: chapter,
      book: book};
};


