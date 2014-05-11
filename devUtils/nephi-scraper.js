var request = require('superagent'),
    url = require('url'),
    parser = require('./nephi-parser'),
    docUrl = 'http://scriptures.nephi.org/docbook/bom/c6.html',
    Q = require('q');

  // TODO compute the next url based on the parsed nextlink and the base url
  // TODO make the walker know about url being parsed so nexurl is easier to compute

function process(docUrl) {
  var dfd = Q.defer();
  request.get(docUrl)
      .end(function (err, res) {
        var data = parser(res.text);
        console.log('parser returned book(%s) chapter(%s) lastverse(%s) nextlink(%s)', data.book, data.chapter, data.lastVerse, data.nextLink);
        docUrl = url.resolve(docUrl, data.nextLink);
        console.log('next document url (%s)', docUrl);
        // TODO translate long book names to short names
        dfd.resolve({book: data.book, chapter: data.chapter, lastVerse: data.lastVerse, nextLink: docUrl});
      });  
  return dfd.promise;
}

if (require.main === module) {
  process(docUrl).then(function (data) {
    process(data.nextLink);
  });
  console.log('ran');
}

