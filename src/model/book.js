/*global BookrCrawler */

var _ = require('lodash'),
    md5 = require('MD5');

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
            authors: [],
            superBook: '',
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
BookrCrawler.Book.prototype.forStorage = function () {
    var storageVars = ['superBook', 'title', 'subtitle', 'authors', 'year', 'publisher', 'isbn', 'textSnippet', 'thumbnail'],
        forMd5 = ['title', 'subtitle', 'authors', 'year', 'publisher', 'isbn', 'textSnippet'],
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

    /**
     * Function that computes a value that represents the quality of a Book
     * @param {Object} source
     * @returns {Number} quality (high = good quality)
     */
    function computeQuality(source) {
        // TODO not hardcoded
        var quality = 0;
        if (source.hasOwnProperty('textSnippet') && source.textSnippet.length){
            quality += source.textSnippet.length;
        }
        if (source.hasOwnProperty('thumbnail') &&
            (source.thumbnail.normal.length || source.thumbnail.small.length)) {
            quality += 10;
        }

        quality += source.hasOwnProperty('publisher') && source.publisher.length ? 10 : 0;

        return quality;
    }

    // generate object from book using storageVars array
    result = objectFromProps(book, storageVars);
    // generate object from results using forMd5 array
    md5props = objectFromProps(result, forMd5);

    // add md5sum from md5props object
    result.hash = md5(JSON.stringify(md5props));

    result.quality = computeQuality(result);

    return result;
};