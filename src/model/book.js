var _ = require('lodash'),
    md5 = md5 || require('MD5');

/**
 * Model that defines the properties for each book
 * @param data
 * @constructor
 */
BookrCrawler.Book = function (data) {
    'use strict';

    var defaultData = {
            key: '',
            title: '',
            subtitle: '',
            authors: [
                ''
            ],
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
        dataItem,
        combinedData = _.defaults(data, defaultData);

    // put everything from combinedData on this
    for (dataItem in combinedData) {
        if (combinedData.hasOwnProperty(dataItem)) {
            this[dataItem] = combinedData[dataItem];
        }
    }
};
BookrCrawler.Book.prototype.forStorage = function () {
    var storageVars = ['title', 'subtitle', 'authors', 'year', 'publisher', 'isbn', 'thumbnail', 'textSnippet'],
        result = {},
        book = this;

    storageVars.forEach(function (storageVar) {
        if (book.hasOwnProperty(storageVar)) {
            result[storageVar] = book[storageVar];
        }
    });

    // add md5sum from book
    result.hash = md5(JSON.stringify(result));

    return result;
};