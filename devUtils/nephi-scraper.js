var request = require('superagent'),
    parser = require('./nephi-parser');

  // TODO compute the next url based on the parsed nextlink and the base url
  // TODO make the walker know about url being parsed so nexurl is easier to compute

if (require.main === module) {
  request.get('http://scriptures.nephi.org/docbook/bom/c6.html')
      .end(function (err, res) {
        var data = parser(res.text);
        console.log('parser returned lastverse(%s) nextlink(%s)', data.lastVerse, data.nextLink);
      });
  console.log('ran');
}

