var bookrCrawler = require('../../dist/bookr-crawler'),
    testUtils = require('../testUtils');

/**
 * test for book merger mergeBooks method
 * @param test
 */

exports.testMergeBooks = function (test) {
    // create merger with google preference
    var mergedDumpResult,
        merger = new bookrCrawler.Merger('google'),
        defaultModel = {
            key: 'google',
            title: 'title-from-google',
            isbn: {
                isbn10: ['0812972155']
            },
            textSnippet: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'

        },
        overwriteModel = {
            key: 'not-google',
            title: 'overwritten by google',
            subtitle: 'not-google subtitle',
            year: '1990',
            isbn: {
                isbn13: ['9780812972153']
            }
        },
        createGoogleBook = function () {
            return createBook(defaultModel);
        },
        createBook = function (params) {
            return new bookrCrawler.Book(params);
        };

    var testDump = [{
        key: 'not-google',
        data: [createBook({
            title: 'book not from google',
            isbn: {
                isbn13: ['123']
            }
        })]
    }, {
        key: 'google',
        data: [createBook({
            title: 'book from google',
            isbn: {
                isbn13: ['123']
            }
        }), createBook({
            title: 'yet another book',
            isbn: {
                isbn13: ['456']
            }
        })]
    }];

    mergedDumpResult = merger.mergeBooks(testDump);

    test.deepEqual(mergedDumpResult, {
        '123': createBook({
            title: 'book from google',
            isbn: {
                isbn13: ['123']
            }
        }),
        '456': createBook({
            title: 'yet another book',
            isbn: {
                isbn13: ['456']
            }
        })
    }, 'true');

    test.done();
};