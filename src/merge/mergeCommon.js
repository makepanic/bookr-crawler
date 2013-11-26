/**
 * Merges two books.
 * @param destination
 * @param source
 * @returns {*}
 */
BookrCrawler.Merger.prototype.merge = function (destination, source) {
    'use strict';

    var key,
        type;

    for (key in source) {
        if (source.hasOwnProperty(key)) {

            if (destination.hasOwnProperty(key)) {
                type = BookrCrawler.Util.Type.getType(source[key]);
                destination[key] = BookrCrawler.Merger.mergeRules[type](destination[key], source[key], source.key === this.prefer);

            } else {
                destination[key] = source[key];
            }
        }
    }

    return destination;
};

/**
 * Finalizes each book object.
 * - removes provider key
 * @param books
 * @param {Boolean} isSuperBook
 * @returns {*}
 */
BookrCrawler.Merger.prototype.finalize = function (books, isSuperBook) {
    'use strict';
    var key,
        bookArray = [];

    if (!isSuperBook) {
        for (key in books) {
            if (books.hasOwnProperty(key)) {
                // prepare for storage
                bookArray.push(books[key].forStorage());
            }
        }
    } else {
        bookArray = books.map(function (book) {
            return book.forStorage();
        });
    }

    return bookArray;
};