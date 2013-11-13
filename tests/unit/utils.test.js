var bookrCrawler = require('../../dist/bookr-crawler');

/**
 * test for isbn type check
 * @param test
 */

exports.testIsbnType = function (test) {
    var testFn = bookrCrawler.Util.Book.isbnType;

    test.equal(testFn('0812972155'), 'isbn10', 'isbn type with empty string');
    test.equal(testFn('9780812972153'), 'isbn13', 'isbn type with empty string');

    test.equal(testFn(''), undefined, 'isbn type with empty string');
    test.equal(testFn(null), undefined, 'isbn type with empty string');
    test.equal(testFn(undefined), undefined, 'isbn type with empty string');
    test.equal(testFn(1), undefined, 'isbn type with empty string');
    test.equal(testFn(false), undefined, 'isbn type with empty string');

    test.done();
};