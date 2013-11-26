var _ = require('lodash'),
    md5 = md5 || require('MD5');

/**
 * Model that defines the properties for each book
 * @param data
 * @constructor
 */
BookrCrawler.SuperBook = function (data) {
    'use strict';

    var defaultData = {
            _id: '',
            title: '',
            subtitle: '',
            authors: [],
            year: '',
            isbns: []
        },
        dataItem,
        combinedData = _.merge(defaultData, data);

    // put everything from combinedData on this
    for (dataItem in combinedData) {
        if (combinedData.hasOwnProperty(dataItem)) {
            this[dataItem] = combinedData[dataItem];
        }
    }
};
BookrCrawler.SuperBook.prototype.forStorage = function () {
    var storageVars = ['_id', 'year', 'title', 'subtitle', 'authors', 'isbns'],
        forMd5 = ['title', 'subtitle', 'authors', 'isbns'],
        md5props,
        result,
        book = this;

    function objectFromProps(source, props) {
        var result = {};
        // create object with given properties from this book
        props.forEach(function (prop) {
            if (source.hasOwnProperty(prop)) {
                result[prop] = source[prop];
            }
        });
        return result;
    }

    // generate object from book using storageVars array
    result = objectFromProps(book, storageVars);
    // generate object from results using forMd5 array
    md5props = objectFromProps(result, forMd5);

    // add md5sum from md5props object
    result.hash = md5(JSON.stringify(md5props));

    return result;
};