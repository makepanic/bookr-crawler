/*global BookrCrawler */
/**
 * Merges an array of books by an unique identifier.
 * If multiple books have the same identifier (e.g. isbn13) then both are merged into one book object.
 * This reduces the result and avoids duplicated content.
 *
 * At the moment it merges if the duplicated book has a prefered origin key (e.g. 'google').
 *
 * @param {Array} dump books
 * @returns {Object} Hashmap of unique books by identifier
 */
BookrCrawler.Merger.prototype.mergeBooks = function (dump) {
    'use strict';

    var prefer = this.prefer,
    // unique books based on isbn13
        uniqueBooks = {},
        beforeMerge = 0,
        uid = this.isbnIdentifier,
        noIsbnKey = 'NO_ISBN_GIVEN';

    dump.forEach(function (dumpItem) {
        var key = dumpItem.key,
            data = dumpItem.data,
            preferThis = !!(key === prefer),
            isbn;

        beforeMerge += data.length;

        data.forEach(function (book) {
            // check if book has isbn identifier
            if (!book.isbn[uid]) {
                // if not generate unique key for this book
                uniqueBooks[noIsbnKey + BookrCrawler.uid()] = book;
            } else {
                // loop through each ispn and update/create unique book
                isbn = book.isbn[uid];

                var alreadyStored = uniqueBooks.hasOwnProperty(isbn),
                    prop,
                    uniqueBook,
                    type;

                // check if there is something in unique map
                if (alreadyStored) {
                    // load stored book
                    uniqueBook = uniqueBooks[isbn];

                    // loop through each property in the book object
                    for (prop in book) {
                        if (book.hasOwnProperty(prop)) {

                            type = BookrCrawler.Util.Type.getType(book[prop]);
                            uniqueBook[prop] = BookrCrawler.Merger.mergeRules[type](uniqueBook[prop], book[prop], preferThis);

                        }
                    }
                    // store updated book
                    uniqueBooks[isbn] = uniqueBook;

                } else {
                    // store book in uniquebooks
                    uniqueBooks[isbn] = book;
                }
            }
        });
    });

    console.log('mergeBooks: before merge', beforeMerge);
    console.log('mergeBooks: after merge', Object.keys(uniqueBooks).length);

    return uniqueBooks;
};
