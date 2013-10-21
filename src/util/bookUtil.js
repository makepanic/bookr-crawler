var BookrCrawlerUtil = BookrCrawlerUtil || {};
BookrCrawlerUtil.BookUtil = {
    isbnType: function (string) {
        'use strict';

        var strLen = string.length;
        return strLen === 13 ? 'isbn13' : strLen === 10 ? 'isbn10' : undefined;
    }
};