var _ = require('lodash');

BookrCrawler.Book = function (data) {
    'use strict';

    var defaultData = {
            title: '',
            subtitle: '',
            authors: [
                ''
            ],
            year: '',
            publisher: '',
            isbn: {
                isbn10: '',
                isbn13: ''
            },
            thumbnail: {
                small: '',
                normal: ''
            },
            textSnippet: ''
        },
        dataItem,
        combinedData = _.extend(defaultData, data);

    // put everything from combinedData on this
    for (dataItem in combinedData) {
        if (combinedData.hasOwnProperty(dataItem)) {
            this[dataItem] = combinedData[dataItem];
        }
    }
};