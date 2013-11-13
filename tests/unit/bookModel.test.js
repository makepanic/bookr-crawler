var bookrCrawler = require('../../dist/bookr-crawler'),
    testUtils = require('../testUtils');

/**
 * test for book model initialization with various values
 * @param test
 */

exports.testModel = function (test) {

    var minimumParameters = {
            key: '',
            title: '',
            subtitle: '',
            authors: [],
            year: '',
            publisher: '',
            isbn: {
                isbn10: [],
                isbn13: []
            },
            thumbnail: {
                small: '',
                normal: ''
            },
            textSnippet: ''
        },
        createModel = function (params) {
            return new bookrCrawler.Book(params);
        };

    test.deepEqual(createModel({}), minimumParameters, 'initializes with empty model');

    test.deepEqual(createModel(undefined), minimumParameters, 'initializes with undefined');
    test.deepEqual(createModel(null), minimumParameters, 'initializes with null');
    test.deepEqual(createModel(1), minimumParameters, 'initializes with 1');
    test.deepEqual(createModel('foobar'), minimumParameters, 'initializes "foobar"');
    test.deepEqual(createModel(false), minimumParameters, 'initializes with false');

    test.done();
};
exports.testModelForStorage = function (test) {
    var forStorage = ['title', 'subtitle', 'authors', 'year', 'publisher', 'isbn', 'textSnippet', 'thumbnail'],
        expectedMd5 = 'a1e2c9f98f871453534de4b5d423a69c',

        createForStorage = function (params) {
            var book = new bookrCrawler.Book(params);
            return book.forStorage();
        },
        hasExpectedFields = function (object) {
            return testUtils.objectContainsFields(object, forStorage);
        };


    test.ok(hasExpectedFields(createForStorage({})), 'initializes with empty model');

    test.ok(hasExpectedFields(createForStorage(undefined)), 'initializes with undefined');
    test.ok(hasExpectedFields(createForStorage(null)), 'initializes with null');
    test.ok(hasExpectedFields(createForStorage(1)), 'initializes with 1');
    test.ok(hasExpectedFields(createForStorage('foobar')), 'initializes "foobar"');
    test.ok(hasExpectedFields(createForStorage(false)), 'initializes with false');

    test.equal(createForStorage({}).hash, expectedMd5, 'erstellter md5 ist korrekt');
    test.equal(createForStorage(undefined).hash, expectedMd5, 'erstellter md5 ist korrekt');
    test.equal(createForStorage(null).hash, expectedMd5, 'erstellter md5 ist korrekt');
    test.equal(createForStorage(1).hash, expectedMd5, 'erstellter md5 ist korrekt');
    test.equal(createForStorage('foobar').hash, expectedMd5, 'erstellter md5 ist korrekt');
    test.equal(createForStorage(false).hash, expectedMd5, 'erstellter md5 ist korrekt');

    test.done();
};
