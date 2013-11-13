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
    }
};