var scraper = require('../devUtils/nephi-scraper'),
    expect = require('chai').expect;

console.log('in test');

describe('Scraper', function () {
  it('should export the parser', function () {
    expect(scraper).to.be.defined;
    expect(scraper.write).to.be.a('function');
    expect(scraper.end).to.be.a('function');
  });
});
