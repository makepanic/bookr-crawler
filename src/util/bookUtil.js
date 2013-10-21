var BookrCrawlerUtil = BookrCrawlerUtil || {};
BookrCrawlerUtil.BookUtil = {
    /**
     * Checks if a given string equals isbn13 or isbn10.
     * Returns {undefined} if invalid.
     * @param string
     * @returns {string}
     */
    isbnType: function (string) {
        'use strict';

        var strLen = string.length;
        return strLen === 13 ? 'isbn13' : strLen === 10 ? 'isbn10' : undefined;
    }
};