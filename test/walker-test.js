var scraper = require('../devUtils/nephi-scraper'),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path');

console.log('in test');

describe('Scraper', function () {
  var html;

  before(function () {
    html = fs.readFileSync(path.join(__dirname, '1-ne_1.html'));
  });

  it('should export the parser', function () {
    expect(scraper).to.be.defined;
    expect(scraper.write).to.be.a('function');
    expect(scraper.end).to.be.a('function');
  });

  it('should remember the last verse number', function () {
    scraper.write(html);
    scraper.end();
    expect(scraper.lastVerse).to.equal('20');
  });
});
