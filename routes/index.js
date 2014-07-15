var Q = require('q'),
    FS = require('fs'),
    path = require('path'),
    readFile = Q.denodeify(FS.readFile),
    scriptures = require('../scriptures'),
    debug = require('debug')('scripture-lottery');

function randomIntegerLessThan(num) {
  return Math.floor(Math.random() * num);
}

function pickOne(list) {
  return list[randomIntegerLessThan(list.length)];
}

function generateViewParams(work) {
  work = work || pickOne(Object.keys(scriptures));

  var book = pickOne(Object.keys(scriptures[work])),
      chapter = Number(pickOne(Object.keys(scriptures[work][book]))) + 1,
      verse = randomIntegerLessThan(scriptures[work][book][chapter - 1]) + 1,
      anchor = '#' + (verse > 1 ? verse - 1 : verse),
      viewParams = {work: work, book: book, chapter: chapter, verse: verse, anchor: anchor};
  
  return viewParams;  
}

/*
 * GET home page.
 */

exports.index = function(req, res){
  var viewParams = generateViewParams();

  debug(viewParams);
  viewParams.title = 'Scripture Lottery';
  res.render('index', viewParams);
};

exports.bofm = function (req, res) {
  var viewParams = generateViewParams('bofm');

  viewParams.title = 'Book of Mormon Scripture Lottery';
  res.render('bofm', viewParams);  
}

exports.e404 = function (req, res) {
  // TODO try serving as static asset instead of rendered view
  res.render('404');
};
