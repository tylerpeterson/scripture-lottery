var Q = require('q'),
    FS = require('fs'),
    path = require('path'),
    readFile = Q.denodeify(FS.readFile),
    yaml = require('yaml'),
    scriptures;

readFile(path.join(__dirname, '..', 'scriptures.json'), 'utf-8').then(function (yamlMarkup) {
  try {
    scriptures = JSON.parse(yamlMarkup);
    console.log('scriptures', scriptures);
  } catch (err) {
    console.log('err parsing yaml', err);
  }
}, function (err) {
  console.log('err loading yaml:', err);
});

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
      verse = randomIntegerLessThan(scriptures[work][book][chapter - 1]) + 1;

  console.log('work, book, chapter, verse', work, book, chapter, verse);
  res.render('index', { title: 'Scripture Lottery', work: work, book: book, chapter: chapter, verse: verse });
};
