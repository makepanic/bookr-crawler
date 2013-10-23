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