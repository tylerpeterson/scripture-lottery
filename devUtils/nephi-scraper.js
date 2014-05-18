var request = require('superagent'),
    url = require('url'),
    parser = require('./nephi-parser'),
    docUrl = 'http://scriptures.nephi.org/docbook/bom/c6.html',
    Q = require('q'),
    debug = require('debug')('nephi-scraper'),
    fs = require('fs'),
    path = require('path');


  // TODO compute the next url based on the parsed nextlink and the base url
  // TODO make the walker know about url being parsed so nexurl is easier to compute

function process(docUrl) {
  var dfd = Q.defer();
  request.get(docUrl)
      .end(function (err, res) {
        var data = parser(res.text);
        console.log('parser returned book(%s) chapter(%s) lastverse(%s) nextlink(%s)', data.book, data.chapter, data.lastVerse, data.nextLink);
        if (data.nextLink) {
          docUrl = url.resolve(docUrl, data.nextLink);
        } else {
          docUrl = null;
        }
        console.log('next document url (%s)', docUrl);
        // TODO translate long book names to short names
        dfd.resolve({book: data.book, chapter: data.chapter, lastVerse: data.lastVerse, nextLink: docUrl});
      });  
  return dfd.promise;
}

function processAll(accumulator, docUrl) {
  return process(docUrl).delay(350).then(function (data) {
    var next = data.nextLink;

    accumulator[data.book] = accumulator[data.book] || {};
    accumulator[data.book][data.chapter] = data.lastVerse;

    fs.writeFileSync(path.join(__dirname, 'output/bom-verses.json'), JSON.stringify(accumulator, null, 2));

    if (next) {
      debug('recursing. Fetching %s', next);
      return processAll(accumulator, next);
    } else {
      debug('Done!');
      return accumulator;
    }
  });
}

if (require.main === module) {
  processAll({}, docUrl).then(function (bomVerses) {
    debug('main done', bomVerses);
  }, function (err) {
    debug(err);
  });
  console.log('ran');
}

