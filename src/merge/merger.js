/*global BookrCrawler */
/**
 * Class that can merge books
 * @param {String} prefer
 * @param {String} [isbnIdentifer=isbn13]
 * @constructor
 */
BookrCrawler.Merger = function (prefer, isbnIdentifer) {
    'use strict';

    this.prefer = prefer;
    this.isbnIdentifier = isbnIdentifer || 'isbn13';
    this.openLibIdentifier = 'OPENLIBRARY';
};

require('./mergeCommon');
require('./mergeRules');
require('./generateSuperBookRelations');
require('./mergeBooks');
