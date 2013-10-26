
/**
 * Merges books by checking if their isbn exists in the OpenLibrary search results. The OpenLibrary results can return
 * multiple isbns for 1 book.
 * @param dump
 * @param openLibrarySearch
 */
BookrCrawler.Merger.prototype.mergeOpenLibrary = function (dump, openLibrarySearch) {
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
                mergedBook = new BookrCrawler.Book(that.merge(mergedBook, dump[isbn]));

                // remove book from dump
                delete dump[isbn];
            }
        });

        // sort isbn10 and isbn13 to make md5 more deterministic
        book.isbn.isbn10 = book.isbn.isbn10.sort();
        book.isbn.isbn13 = book.isbn.isbn13.sort();

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
