var bookrCrawler = require('../../dist/bookr-crawler'),
    testUtils = require('../testUtils');

/**
 * test for book merger merge
 * @param test
 */

exports.testMerge = function (test) {
    // create merger with google preference
    var merger = new bookrCrawler.Merger('google'),
        defaultModel = {
            key: 'google',
            title: 'title-from-google',
            isbn: {
                isbn10: '0812972155'
            },
            textSnippet: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'

        },
        overwriteModel = {
            key: 'not-google',
            title: 'overwritten by google',
            subtitle: 'not-google subtitle',
            year: '1990',
            isbn: {
                isbn13: '9780812972153'
            }
        },
        createGoogleBook = function () {
            return createBook(defaultModel);
        },
        createBook = function (params) {
            return new bookrCrawler.Book(params);
        };

    test.deepEqual(merger.merge(createBook(overwriteModel), createGoogleBook()), createBook({
        key: defaultModel.key,
        title: defaultModel.title,
        subtitle: overwriteModel.subtitle,
        year: overwriteModel.year,
        isbn: {
            isbn10: defaultModel.isbn.isbn10,
            isbn13: overwriteModel.isbn.isbn13
        },
        textSnippet: defaultModel.textSnippet
    }), 'merged book');

    test.done();
};