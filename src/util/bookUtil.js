/*global BookrCrawler */

var ISBN = require('isbn').ISBN;

BookrCrawler.Util.Book = {
    /**
     * Checks if a given string equals isbn13 or isbn10.
     * Returns {undefined} if invalid.
     * @param value
     * @returns {string}
     */
    isbnType: function (value) {
        'use strict';

        // check if value is string and use length, otherwise length is 0
        var strLen = Object.prototype.toString.call(value) === '[object String]' ? value.length : 0;
        return strLen === 13 ? 'isbn13' : strLen === 10 ? 'isbn10' : undefined;
    },

    /**
     * Groups 13/10 isbns together and returns an array of arrays
     * TODO refactor to reduce ISBN function calls
     * @param {Array} isbns
     * @returns {Array} array of all isbn combinations. Each item in the array consists of [isbn10, isbn13]
     */
    groupIsbns: function (isbns) {
        var isbnMap = {},
            groupedIsbns = [];

        isbns.forEach(function (isbn) {
            var parsedIsbn = ISBN.parse(isbn);

            // generate key value map with key = isbn10 value = isbn13
            if (parsedIsbn){
                // call asIsbn function to get the same format for every valid isbn
                if (parsedIsbn.isIsbn10()) {
                    isbnMap[parsedIsbn.asIsbn10()] = parsedIsbn.asIsbn13();
                } else if(parsedIsbn.isIsbn13()) {
                    isbnMap[parsedIsbn.asIsbn10()] = parsedIsbn.asIsbn13();
                } else {
                    console.error('something is wrong with ' + isbn);
                }
            } else {
                console.error('something is wrong with ' + isbn);
            }
        });

        // generate array combining key and value [[isbn10, isbn13]]
        Object.keys(isbnMap).forEach(function (key) {
            groupedIsbns.push([key, isbnMap[key]]);
        });

        return groupedIsbns;
    }
};