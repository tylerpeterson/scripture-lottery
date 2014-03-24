
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Scripture Lottery', work: 'bofm', book: '2-ne', chapter: '9', verse: '28' });
};
