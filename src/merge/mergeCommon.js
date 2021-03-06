/*global BookrCrawler */
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
 * @see {@link BookrCrawler.Book.forStorage}
 * @param {Array} books
 * @returns {Array}
 */
BookrCrawler.Merger.prototype.finalize = function (books) {
    'use strict';
    var key,
        bookArray = [];

    for (key in books) {
        if (books.hasOwnProperty(key)) {
            // prepare for storage
            bookArray.push(books[key].forStorage());
        }
    }

    return bookArray;
};

/**
 * Finalizes each SuperBook object.
 * @see {@link BookrCrawler.SuperBook.forStorage}
 * @param {Array} superBooks
 * @returns {Array}
 */
BookrCrawler.Merger.prototype.finalizeSuperBook = function (superBooks) {
    'use strict';
    var bookArray = [];

    bookArray = superBooks.map(function (book) {
        return book.forStorage();
    });

    return bookArray;
};