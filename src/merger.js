BookrCrawler.merge = function (dump) {
    'use strict';

    var prefer = 'google',
        // unique books based on isbn13
        uniqueBooks = {},
        beforeMerge = 0;

    dump.forEach(function (dumpItem) {
        var key = dumpItem.key,
            data = dumpItem.data,
            preferThis = !!(key === prefer);

        beforeMerge += data.length;

        data.forEach(function (book) {
            var id = book.isbn.isbn13,
                alreadyStored = uniqueBooks.hasOwnProperty(id),
                prop,
                uniqueBook,
                uniqueVal;

            // check if there is something in unique map
            if (alreadyStored) {
                // load stored book
                uniqueBook = uniqueBooks[id];

                // loop through each property in the book object
                for (prop in book) {
                    if (book.hasOwnProperty(prop)) {

                        // check if this prop exists in uniquebook
                        uniqueVal = uniqueBook[prop];

                        // if something is stored in the other book and prefer this and prop.length
                        if (uniqueVal.length && preferThis && book[prop].length) {
                            // overwrite property
                            uniqueBook[prop] = book[prop];
                        }
                    }
                }
                // store updated book
                uniqueBooks[id] = uniqueBook;

            } else {
                // store book in uniquebooks
                uniqueBooks[id] = book;
            }
        });
    });

    console.log('before merge', beforeMerge);
    console.log('after merge', Object.keys(uniqueBooks).length);

    return uniqueBooks;
};