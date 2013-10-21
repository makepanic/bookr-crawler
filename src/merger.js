BookrCrawler.Merger = function (prefer) {
    'use strict';

    this.prefer = prefer;
    this.isbnIdentifier = 'isbn13';
    this.openLibIdentifier = 'OPENLIBRARY';
};

/**
 * Merges an array of books by an unique identifier.
 * If multiple books have the same identifier (e.g. isbn13) then both are merged into one book object.
 * This reduces the result and avoids duplicated content.
 *
 * At the moment it merges if the duplicated book has a prefered origin key (e.g. 'google').
 *
 * @param dump {Array} books
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
            preferThis = !!(key === prefer);

        beforeMerge += data.length;

        data.forEach(function (book) {
            // check if book has isbn identifier
            if (!book.isbn[uid]) {
                // if not generate unique key for this book
                uniqueBooks[noIsbnKey + BookrCrawler.uid()] = book;
            } else {
                // loop through each ispn and update/create unique book
                book.isbn[uid].forEach(function (id) {

                    var alreadyStored = uniqueBooks.hasOwnProperty(id),
                        prop,
                        uniqueBook,
                        uniqueVal,
                        type;

                    // check if there is something in unique map
                    if (alreadyStored) {
                        // load stored book
                        uniqueBook = uniqueBooks[id];

                        // loop through each property in the book object
                        for (prop in book) {
                            if (book.hasOwnProperty(prop)) {

                                type = BookrCrawlerUtil.Type.getType(book[key]);
                                uniqueBook[prop] = BookrCrawler.Merger.mergeRules[type](uniqueBook[prop], book[prop]);

                            }
                        }
                        // store updated book
                        uniqueBooks[id] = uniqueBook;

                    } else {
                        // store book in uniquebooks
                        uniqueBooks[id] = book;
                    }

                });
            }
        });
    });

    console.log('mergeBooks: before merge', beforeMerge);
    console.log('mergeBooks: after merge', Object.keys(uniqueBooks).length);

    return uniqueBooks;
};

/**
 * Rules for merging 2 values.
 * @type {{array: Function, string: Function, object: Function}}
 */
BookrCrawler.Merger.mergeRules = {
    'array': function (a, b) {
        'use strict';

        var concat = a.concat(b);

        // via http://stackoverflow.com/a/9229821
        return concat.filter(function (elem, pos) {
            return concat.indexOf(elem) === pos;
        });
    },
    'string': function (a, b) {
        'use strict';
        var merged = '';
        if ((a === undefined || b === undefined) && a !== b) {
            merged = a || b;
        } else {
            merged = a.length > b.length ? a : b;
        }

        return merged;
    },
    'object': function (a, b) {
        'use strict';
        var src,
            dest,
            key,
            type;

        if (Object.keys(a).length > Object.keys(b).length) {
            // a has more properties
            dest = b;
            src = a;
        } else {
            // b has more or equal properties
            dest = a;
            src = b;
        }

        for (key in src) {
            if (src.hasOwnProperty(key)) {

                if (dest.hasOwnProperty(key)) {
                    type = BookrCrawlerUtil.Type.getType(src[key]);

                    dest[key] = BookrCrawler.Merger.mergeRules[type](dest[key], src[key]);
                } else {
                    dest[key] = src[key];
                }
            }
        }

        return dest;
    }
};

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

                if (source.key === this.prefer) {
                    destination[key] = source[key];
                } else {
                    type = BookrCrawlerUtil.Type.getType(source[key]);

                    destination[key] = BookrCrawler.Merger.mergeRules[type](destination[key], source[key]);
                }
            } else {
                destination[key] = source[key];
            }
        }
    }

    return destination;
};

/**
 * Merges books by checking if their isbn exists in the OpenLibrary search results. The OpenLibrary results can return
 * multiple isbns for 1 book.
 * @param dump
 * @param openLibrarySearch
 */
BookrCrawler.Merger.prototype.mergeByOpenLibrarySearch = function (dump, openLibrarySearch) {
    'use strict';

    var that = this,
        mergedBook,
        beforeMerge = Object.keys(dump).length;

    openLibrarySearch.data.forEach(function (book) {
        mergedBook = {
            // flag that allows to check if a existing book was found
            empty: true
        };

        // loop through each isbn from the openlib book object
        book.isbn[that.isbnIdentifier].forEach(function (isbn) {

            // check if there exist a book with a given isbn
            if (dump.hasOwnProperty(isbn)) {
                // change empty flag
                mergedBook.empty = false;

                // merge found book with openlib merged book
                mergedBook = that.merge(mergedBook, dump[isbn]);

                // remove book from dump
                delete dump[isbn];
            }
        });

        if (!mergedBook.empty) {
            // remove empty flag
            delete mergedBook.empty;

            // create new book in dump with merged book
            dump[that.openLibIdentifier + BookrCrawler.uid()] = mergedBook;
        }
    });

    console.log('openlibrary search: before merge', beforeMerge);
    console.log('openlibrary search: after merge', Object.keys(dump).length);

    return dump;
};

/**
 * Finalizes each book object.
 * - removes provider key
 * @param books
 * @returns {*}
 */
BookrCrawler.Merger.prototype.finalize = function (books) {
    'use strict';
    var key;

    for (key in books) {
        if (books.hasOwnProperty(key)) {
            // remove provider key
            delete books[key].key;
        }
    }

    return books;
};