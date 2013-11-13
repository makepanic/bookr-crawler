var bookrCrawler = require('../../dist/bookr-crawler');

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