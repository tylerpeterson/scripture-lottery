var request = require('superagent');
var url = require('url');
var parser = require('./nephi-parser');
var docUrl = 'http://scriptures.nephi.org/docbook/bom/c6.html';
var Q = require('q');
var debug = require('debug')('nephi-scraper');
var fs = require('fs');
var path = require('path');
var bookNames = {
  "The First Book of Nephi": "1-ne",
  "The Second Book of Nephi": "2-ne",
  "The Book of Jacob": "jacob",
  "The Book of Enos": "enos",
  "The Book of Jarom": "jarom",
  "The Book of Omni": "omni",
  "Words of Mormon": "w-of-m",
  "The Book of Mosiah": "mosiah",
  "The Book of Alma": "alma",
  "The Book of Helaman": "hel",
  "The Third Book of Nephi": "3-ne",
  "The Fourth Book of Nephi": "4-ne",
  "The Book of Mormon": "morm",
  "The Book of Ether": "ether",
  "The Book of Moroni": "moro"
};


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
    var book = bookNames[data.book] || data.book;

    accumulator.bofm = accumulator.bofm || {};
    accumulator.bofm[book] = accumulator.bofm[book] || [];
    accumulator.bofm[book].push(parseInt(data.lastVerse));

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

