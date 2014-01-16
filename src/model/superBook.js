/*global BookrCrawler */

var _ = require('lodash'),
    md5 = require('MD5');

/**
 * SuperBook model that defines the properties for each superBook
 * @param {Object} data
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
/**
 * Function that computes properties that are useful for storing the model and returns an object with all required properties.
 * @returns {Object}
 */
BookrCrawler.SuperBook.prototype.forStorage = function () {
    var storageVars = ['_id', 'year', 'title', 'subtitle', 'authors', 'isbns'],
        forMd5 = ['title', 'subtitle', 'authors', 'isbns'],
        md5props,
        result,
        book = this;

    /**
     * Function that creates a new object from a given object using a list of properties
     * @param {Object} source
     * @param {Array} props
     * @returns {Object}
     */
    function objectFromProps(source, props) {
        var obj = {};
        // create object with given properties from this book
        props.forEach(function (prop) {
            if (source.hasOwnProperty(prop)) {
                obj[prop] = source[prop];
            }
        });
        return obj;
    }

    // generate object from book using storageVars array
    result = objectFromProps(book, storageVars);
    // generate object from results using forMd5 array
    md5props = objectFromProps(result, forMd5);

    // add md5sum from md5props object
    result.hash = md5(JSON.stringify(md5props));

    return result;
};