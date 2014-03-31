var scraper = require('../devUtils/nephi-scraper'),
    expect = require('chai').expect;

console.log('in test');

describe('Scraper', function () {
  it('should be included as a module', function () {
    expect(scraper).to.be.defined;
  });
});
