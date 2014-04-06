var parser = require('../devUtils/nephi-parser'),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path');

describe('Scraper', function () {
  var html;

  before(function () {
    html = fs.readFileSync(path.join(__dirname, '1-ne_1.html'));
  });

  it('should export the parser', function () {
    expect(parser).to.be.a('function');
  });

  it('should remember the last verse number', function () {
    expect(parser(html).lastVerse).to.equal('20');
  });

  it('should remember the next link', function() {
    expect(parser(html).nextLink).to.equal('ch2.html');
  });
});
