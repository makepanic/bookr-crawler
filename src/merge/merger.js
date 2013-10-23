/**
 * Class that can merge books
 * @param prefer {String}
 * @constructor
 */
BookrCrawler.Merger = function (prefer) {
    'use strict';

    this.prefer = prefer;
    this.isbnIdentifier = 'isbn13';
    this.openLibIdentifier = 'OPENLIBRARY';
};

require('./mergeCommon');
require('./mergeRules');
require('./mergeOpenLibrary');
require('./mergeBooks');
