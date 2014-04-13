var parser = require('../devUtils/nephi-parser'),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path');

describe('Scraper', function () {
  it('should export the parser', function () {
    expect(parser).to.be.a('function');
  });

  ['first-in-a-book', 'normal-chapter'].forEach(function (scenario) {
    describe(scenario, function () {
      var html;

      before(function () {
        html = fs.readFileSync(path.join(__dirname, scenario + '.html'));
      });

      it('should remember the last verse number', function () {
        expect(parser(html).lastVerse).to.equal('20');
      });

      it('should remember the next link', function() {
        expect(parser(html).nextLink).to.equal('ch2.html');
      });

      it.skip('should remember the chapter number', function () {
        expect(parser(html).chapter).to.equal('1');
      });

      it.skip('should remember the book', function () {
        expect(parser(html).book).to.equal('The Book of Jacob');
      })
    });
  });
});
