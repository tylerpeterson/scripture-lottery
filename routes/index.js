var Q = require('q'),
    FS = require('fs'),
    path = require('path'),
    readFile = Q.denodeify(FS.readFile),
    scriptures = require('../scriptures');

function randomIntegerLessThan(num) {
  return Math.floor(Math.random() * num);
}

function pickOne(list) {
  return list[randomIntegerLessThan(list.length)];
}


/*
 * GET home page.
 */

exports.index = function(req, res){
  var work = pickOne(Object.keys(scriptures)),
      book = pickOne(Object.keys(scriptures[work])),
      chapter = Number(pickOne(Object.keys(scriptures[work][book]))) + 1,
      verse = randomIntegerLessThan(scriptures[work][book][chapter - 1]) + 1,
      anchor = '#' + (verse > 1 ? verse - 1 : verse),
      viewParams = {work: work, book: book, chapter: chapter, verse: verse, anchor: anchor};

  console.log(viewParams);
  viewParams.title = 'Scripture Lottery';
  res.render('index', viewParams);
};
