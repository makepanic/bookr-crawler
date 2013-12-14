(function (root, factory) {
    'use strict';

    // CommonJS
    if (typeof exports === 'object' && module) {
        module.exports = factory();

        // AMD
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
        // Browser
    } else {
        root.BookrCrawler = factory();
    }
}((typeof window === 'object' && window) || this, function () {;'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Bookr = {},
    BookrCrawler = {
        _i: 0,
        version: '0.1.4',
        /**
         * @returns {Number}
         */
        uid: function () {
            this._i += 1;
            return this._i;
        },
        constants: {
            NO_ISBN_KEY: 'NO_ISBN_GIVEN'
        },
        Util: {}
    };


// provide namespace
var Bookr = Bookr || {},
    Q = Q || require('q');

Bookr.AsyncHelper = {
    wrapInPromise: function (callback) {
        'use strict';

        var defer = Q.defer();

        callback(defer);

        return defer.promise;

    }
};

var ISBN = require('isbn').ISBN;

BookrCrawler.Util.Book = {
    /**
     * Checks if a given string equals isbn13 or isbn10.
     * Returns {undefined} if invalid.
     * @param value
     * @returns {string}
     */
    isbnType: function (value) {
        'use strict';

        // check if value is string and use length, otherwise length is 0
        var strLen = Object.prototype.toString.call(value) === '[object String]' ? value.length : 0;
        return strLen === 13 ? 'isbn13' : strLen === 10 ? 'isbn10' : undefined;
    },

    /**
     * Groups 13/10 isbns together and returns an array of arrays
     * TODO refactor to reduce ISBN function calls
     * @param {Array} isbns
     * @returns {Array} array of all isbn combinations. Each item in the array consists of [isbn10, isbn13]
     */
    groupIsbns: function (isbns) {
        var isbnMap = {},
            groupedIsbns = [],
            key;

        isbns.forEach(function (isbn) {
            var parsedIsbn = ISBN.parse(isbn);

            // generate key value map with key = isbn10 value = isbn13
            if (parsedIsbn){
                // call asIsbn function to get the same format for every valid isbn
                if (parsedIsbn.isIsbn10()) {
                    isbnMap[parsedIsbn.asIsbn10()] = parsedIsbn.asIsbn13();
                } else if(parsedIsbn.isIsbn13()) {
                    isbnMap[parsedIsbn.asIsbn10()] = parsedIsbn.asIsbn13();
                } else {
                    console.error('something is wrong with ' + isbn);
                }
            } else {
                console.error('something is wrong with ' + isbn);
            }
        });

        // generate array combining key and value [[isbn10, isbn13]]
        Object.keys(isbnMap).forEach(function (key) {
            groupedIsbns.push([key, isbnMap[key]]);
        });

        return groupedIsbns;
    }
};

(function (BookrCrawlerUtil) {
    'use strict';

    var types,
        checkFn,
        typesReverse;

    checkFn = function (val) {
        return Object.prototype.toString.call(val);
    };

    typesReverse = {
        '[object Array]': 'array',
        '[object Function]': 'function',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Object]': 'object',
        '[object Boolean]': 'boolean'
    };

    types = {
        /**
         * Checks if a value is an array
         * @param val {*}
         * @returns {boolean}
         */
        'array': function (val) {
            return checkFn(val) === '[object Array]';
        },
        /**
         * Checks if a value is a function
         * @param val {*}
         * @returns {boolean}
         */
        'function': function (val) {
            return checkFn(val) === '[object Function]';
        },

        /**
         * Checks if a value is a number
         * @param val
         * @returns {boolean}
         */
        'number': function (val) {
            return !isNaN(val) && checkFn(val) === '[object Number]';
        },

        /**
         * Checks if a value is a string
         * @param val
         * @returns {boolean}
         */
        'string': function (val) {
            return checkFn(val) === '[object String]';
        },

        /**
         * Checks if a value is a object
         * @param val
         * @returns {boolean}
         */
        'object': function (val) {
            return checkFn(val) === '[object Object]';
        },

        /**
         * Checks if a value is a boolean
         * @param val
         * @returns {boolean}
         */
        'boolean': function (val) {
            return checkFn(val) === '[object Boolean]';
        }
    };

    BookrCrawlerUtil.Type = {
        /**
         * Checks if a value is of a given type
         * @param type {string}
         * @param value {*}
         * @returns {*} true if is of type
         */
        is: function (type, value) {
            var is;
            if (types.hasOwnProperty(type)) {
                is = types[type](value);
            }
            return is;
        },

        /**
         * Returns a type for a given value
         * @param value
         * @returns {{[object Array]: string, [object Function]: string, [object Number]: string, [object String]: string, [object Object]: string, [object Boolean]: string}}
         */
        getType: function (value) {
            var toString = checkFn(value);
            return types[typesReverse[toString]](value) ? typesReverse[toString] : undefined;
        }
    };
}(BookrCrawler.Util));

var _ = require('lodash'),
    md5 = md5 || require('MD5');

/**
 * Model that defines the properties for each book
 * @param data
 * @constructor
 */
BookrCrawler.Book = function (data) {
    'use strict';

    var defaultData = {
            key: '',
            title: '',
            subtitle: '',
            authors: [],
            superBook: '',
            year: '',
            publisher: '',
            isbn: {
                isbn10: '',
                isbn13: ''
            },
            thumbnail: {
                small: '',
                normal: ''
            },
            textSnippet: ''
        },
        dataItem,
        combinedData = _.merge(defaultData, data);

    // put everything from combinedData on this
    for (dataItem in combinedData) {
        if (combinedData.hasOwnProperty(dataItem)) {
            this[dataItem] = combinedData[dataItem];
        }
    }
};
BookrCrawler.Book.prototype.forStorage = function () {
    var storageVars = ['superBook', 'title', 'subtitle', 'authors', 'year', 'publisher', 'isbn', 'textSnippet', 'thumbnail'],
        forMd5 = ['title', 'subtitle', 'authors', 'year', 'publisher', 'isbn', 'textSnippet'],
        md5props,
        result,
        book = this;

    function objectFromProps(source, props) {
        var result = {};
        // create object with given properties from this book
        props.forEach(function (prop) {
            if (source.hasOwnProperty(prop)) {
                result[prop] = source[prop];
            }
        });
        return result;
    }

    function computeQuality(source) {
        // TODO not hardcoded
        var quality = 0;
        if (source.hasOwnProperty('textSnippet') && source.textSnippet.length){
            quality += source.textSnippet.length;
        }
        if (source.hasOwnProperty('thumbnail') &&
            (source.thumbnail.normal.length || source.thumbnail.small.length)) {
            quality += 10;
        }

        quality += source.hasOwnProperty('publisher') && source.publisher.length ? 10 : 0;

        return quality;
    }

    // generate object from book using storageVars array
    result = objectFromProps(book, storageVars);
    // generate object from results using forMd5 array
    md5props = objectFromProps(result, forMd5);

    // add md5sum from md5props object
    result.hash = md5(JSON.stringify(md5props));

    result.quality = computeQuality(result);

    return result;
};

var _ = require('lodash'),
    md5 = md5 || require('MD5');

/**
 * Model that defines the properties for each book
 * @param data
 * @constructor
 */
BookrCrawler.SuperBook = function (data) {
    'use strict';

    var defaultData = {
            _id: '',
            title: '',
            subtitle: '',
            authors: [],
            year: '',
            isbns: []
        },
        dataItem,
        combinedData = _.merge(defaultData, data);

    // put everything from combinedData on this
    for (dataItem in combinedData) {
        if (combinedData.hasOwnProperty(dataItem)) {
            this[dataItem] = combinedData[dataItem];
        }
    }
};
BookrCrawler.SuperBook.prototype.forStorage = function () {
    var storageVars = ['_id', 'year', 'title', 'subtitle', 'authors', 'isbns'],
        forMd5 = ['title', 'subtitle', 'authors', 'isbns'],
        md5props,
        result,
        book = this;

    function objectFromProps(source, props) {
        var result = {};
        // create object with given properties from this book
        props.forEach(function (prop) {
            if (source.hasOwnProperty(prop)) {
                result[prop] = source[prop];
            }
        });
        return result;
    }

    // generate object from book using storageVars array
    result = objectFromProps(book, storageVars);
    // generate object from results using forMd5 array
    md5props = objectFromProps(result, forMd5);

    // add md5sum from md5props object
    result.hash = md5(JSON.stringify(md5props));

    return result;
};

(function (BookrCrawler) {
    'use strict';
    var providers = {};


var Q = Q || require('q'),
    request = request || require('request'),
    nconf = nconf || require('nconf'),
    providers = providers || {};

/**
 * Provider for the google books api
 * @returns {{crawl: Function}}
 */
providers.google = function () {
    'use strict';

    var crawl,
        baseUrl = 'https://www.googleapis.com/books/v1/volumes?q=',
        /**
         * Creates a {@link BookrCrawler.Book} form a provider json object
         */
        bookConverter = function (item) {
            var volumeInfo = item.volumeInfo,
                searchInfo = item.searchInfo,
                book,
                data,
                imageLink;

            // check if object and object has isbns
            if (volumeInfo && volumeInfo.industryIdentifiers) {
                data = {
                    key: 'google',
                    title: volumeInfo.title,
                    subtitle: volumeInfo.subtitle,
                    publisher: volumeInfo.publisher,
                    authors: volumeInfo.authors,
                    textSnippet: '',
                    isbn: {},
                    thumbnail: {}
                };
                // add textSnippet
                data.textSnippet = searchInfo ? searchInfo.textSnippet : '';

                // convert year
                data.year = volumeInfo.publishedDate.substr(0, 4);

                // convert isbn numbers
                volumeInfo.industryIdentifiers.forEach(function (isbn) {
                    switch (isbn.type) {
                    case 'ISBN_10':
                        data.isbn.isbn10 = isbn.identifier;
                        break;
                    case 'ISBN_13':
                        data.isbn.isbn13 = isbn.identifier;
                        break;
                    }
                });

                // convert thumbnails
                for (imageLink in volumeInfo.imageLinks) {
                    if (volumeInfo.imageLinks.hasOwnProperty(imageLink)) {
                        if (imageLink === 'smallThumbnail') {
                            data.thumbnail.small = volumeInfo.imageLinks[imageLink];
                        } else {
                            data.thumbnail.normal = volumeInfo.imageLinks[imageLink];
                        }
                    }
                }

                book = new BookrCrawler.Book(data);
            }

            return book;
        };



    crawl = function (query) {
        var deferred = Q.defer();

        // start request
        request(baseUrl + query, function (err, resp, body) {
            var books = [],
                responseData;

            if (!err && resp.statusCode === 200) {

                try {
                    responseData = JSON.parse(body);

                    responseData.items.forEach(function (item) {
                        var convertedBook = bookConverter(item);

                        if (convertedBook) {
                            books.push(convertedBook);
                        }
                    });

                } catch (e) {
                    console.error('Error parsing json. ' + e);
                }
            }
            deferred.resolve({
                data: books,
                key: 'google'
            });
        });

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};

var Q = Q || require('q'),
    request = request || require('request'),
    nconf = nconf || require('nconf'),
    providers = providers || {},
    isbndb;

nconf.file({ file: 'bookr-config.json' });

isbndb = nconf.get('isbndb');

/**
 * Provider for the isbndb api
 * @returns {{crawl: Function}}
 */
providers.isbndb = function () {
    'use strict';

    var crawl,
        baseUrl = 'http://isbndb.com/api/v2/json/' + isbndb.key + '/books?q=',
        bookConverter = function (item) {
            var book,
                data;

            data = {
                key: 'isbndb',
                title: item.title,
                subtitle: item.title_long,
                publisher: item.publisher_text,
                isbn: {
                    isbn10: item.isbn10,
                    isbn13: item.isbn13
                },
                authors: []
            };

            item.author_data.forEach(function (authorData) {
                data.authors.push(authorData.name);
            });

            book = new BookrCrawler.Book(data);

            return book;
        };

    crawl = function (query) {
        var deferred = Q.defer();

        // start request
        request(baseUrl + query, function (err, resp, body) {
            var books = [],
                responseData;

            if (!err && resp.statusCode === 200) {

                try {
                    responseData = JSON.parse(body);

                    // check if correct response object exists
                    if (responseData && responseData.data) {
                        responseData.data.forEach(function (item) {
                            books.push(bookConverter(item));
                        });
                    }
                } catch (e) {
                    console.error('Error parsing json. ' + e);
                }
            }
            deferred.resolve({
                data: books,
                key: 'isbndb'
            });
        });

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};

var Q = Q || require('q'),
    request = request || require('request'),
    nconf = nconf || require('nconf'),
    providers = providers || {};

/**
 * Provider for the openlibrary api
 * @returns {{crawl: Function}}
 */
providers.openlibrary = function () {
    'use strict';

    var crawl,
        baseUrl = 'http://openlibrary.org/search.json?q=',
        bookConverter = function (item) {
            var book,
                data;

            data = {
                key: 'openlibrary',
                title: item.title,
                subtitle: item.subtitle,
                isbns: [],
                isbn: {
                    isbn10: [],
                    isbn13: []
                },
                authors: item.author_name,
                year: item.first_publish_year,
                textSnippet: item.first_sentence && item.first_sentence.length ? item.first_sentence[0] : '',
                _id: item.key
            };

            if (item.isbn) {
                data.isbns = BookrCrawler.Util.Book.groupIsbns(item.isbn);

                item.isbn.forEach(function (isbn) {
                    // add isbn to fitting isbn type (13 or 10)
                    var type = BookrCrawler.Util.Book.isbnType(isbn);
                    if (type) {
                        data.isbn[type].push(isbn);
                    }
                });
            }

            book = new BookrCrawler.SuperBook(data);

            return book;
        };

    crawl = function (query) {
        var deferred = Q.defer();

        // start request
        request(baseUrl + query, function (err, resp, body) {
            var books = [],
                responseData;

            if (!err && resp.statusCode === 200) {

                try {
                    responseData = JSON.parse(body);

                    // check if correct response object exists
                    if (responseData && responseData.docs) {
                        responseData.docs.forEach(function (item) {
                            // create book and check if it has isbns
                            var book = bookConverter(item);
                            if (book.isbns.length){
                                books.push(book);
                            }
                        });
                    }
                } catch (e) {
                    console.error('Error parsing json. ' + e);
                }
            }

            deferred.resolve({
                data: books,
                key: 'openlibrary'
            });
        });

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};

    /**
     * Provider factory that returns a requested provider
     * @param provider
     * @returns {{crawl: Function}}
     * @constructor
     */
    BookrCrawler.Provider = function (provider) {
        var api = {
            crawl: function () {}
        };

        if (providers.hasOwnProperty(provider)) {
            // found provider
            console.log('using provider: ', provider);
            api = providers[provider]();
        }

        return api;
    };

}(BookrCrawler));



/**
 * Main method to crawl given provider
 * @param currentCfg
 * @returns {*} Promise
 */
BookrCrawler.crawl = function (currentCfg) {
    var deferred = Q.defer(),
        defaultCfg = {
            provider: [],
            query: ''
        },
        cfg = _.extend(defaultCfg, currentCfg),
        provider = cfg.provider,
        query = cfg.query,
        promises = [];

    provider.forEach(function (p) {
        // push crawl promise of every provider
        promises.push(BookrCrawler.Provider(p).crawl(query));
    });

    // execute all provider crawl promises
    Q.all(promises).then(function (results) {
        deferred.resolve(results);
    });

    return deferred.promise;
};

/**
 * Method that combines the crawl function and merges the results afterwards
 * @param currentCfg
 * @returns {*} merged map of books
 */
BookrCrawler.mergeCrawl = function (currentCfg) {
    var defaultCfg = {
            provider: [],
            query: '',
            prefer: 'google'
        },
        cfg = _.extend(defaultCfg, currentCfg);

    return this.crawl({
        provider: cfg.provider,
        query: cfg.query
    }).then(function (data) {
        var merger = new BookrCrawler.Merger(cfg.prefer),
            deferred = Q.defer(),
            merged,
            openLibData,
            easyMergeData;


        // filter special provider
        easyMergeData = data.filter(function (data) {
            var easyMerge = true;

            if (data.key === 'openlibrary') {
                openLibData = data;
                easyMerge = false;
            }

            return easyMerge;
        });

        // simple merge books
        merged = merger.mergeBooks(easyMergeData);

        // merge via openlibrary results
        merged = merger.generateSuperBookRelations(merged, openLibData);

        // remove unused properties
        merged = merger.finalize(merged);

        // merge openlibdata
        openLibData = merger.finalizeSuperBook(openLibData.data);

        setTimeout(function () {
            deferred.resolve({
                versions: merged,
                superBooks: openLibData
            });
        }, 14);

        return deferred.promise;
    });
};

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
 * @returns {*}
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
BookrCrawler.Merger.prototype.finalizeSuperBook = function (superBooks) {
    'use strict';
    var key,
        bookArray = [];

    bookArray = superBooks.map(function (book) {
        return book.forStorage();
    });

    return bookArray;
};

/**
 * Rules for merging 2 values.
 * @type {{array: Function, string: Function, object: Function}}
 */
BookrCrawler.Merger.mergeRules = {
    /**
     * Rule for merging 2 arrays
     * Merge result is generated by concantenating both arrays and removing duplicate entries.
     *
     * @param {Array} a destination
     * @param {Array} b source
     * @returns {Array} merged array
     */
    'array': function (a, b) {
        'use strict';

        var concat = a.concat(b);

        // via http://stackoverflow.com/a/9229821
        return concat.filter(function (elem, pos) {
            return concat.indexOf(elem) === pos;
        });
    },
    /**
     * Rule for merging 2 strings
     * Merge result is generated by comparing for undefined and length.
     * If overwriteAIfB is true, it overwrites a if be has a length greater 0.
     *
     * @param {String} a destination
     * @param {String} b source
     * @param {Boolean} overwriteAIfB overwrite a if b is not empt
     * @returns {String} merged string
     */
    'string': function (a, b, overwriteAIfB) {
        'use strict';
        var merged = '';
        if ((a === undefined || b === undefined) && a !== b) {
            merged = a || b;
        } else {
            merged = a.length > b.length && !(overwriteAIfB && b.length > 0) ? a : b;
        }

        return merged;
    },
    /**
     * Rule for merging 2 objects
     * Merge result is generated iterating over each property and merging it via other rules from {@link BookrCrawler.Merger.m
     * }
     *
     * @see {@link BookrCrawler.Merger.mergeRules.array}
     * @see {@link BookrCrawler.Merger.mergeRules.string}
     * @see {@link BookrCrawler.Merger.mergeRules.object}
     * @param {Object} a destination
     * @param {Object} b source
     * @param {Boolean} overwriteAIfB
     * @returns {Object} merged object
     */
    'object': function (a, b, overwriteAIfB) {
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
                    type = BookrCrawler.Util.Type.getType(src[key]);

                    dest[key] = BookrCrawler.Merger.mergeRules[type](dest[key], src[key], overwriteAIfB);
                } else {
                    dest[key] = src[key];
                }
            }
        }

        return dest;
    }
};


/**
 * Merges books by checking if their isbn exists in the OpenLibrary search results. The OpenLibrary results can return
 * multiple isbns for 1 book.
 * @param dump
 * @param superBooks
 */
BookrCrawler.Merger.prototype.generateSuperBookRelations = function (dump, superBooks) {
    'use strict';

    var that = this,
        mergedBook,
        isbn,
        beforeMerge = Object.keys(dump).length;

    superBooks.data.forEach(function (superBook) {
        mergedBook = {
            // flag that allows to check if a existing book was found
            empty: true
        };

        // loop through each isbn from the openlib book object
        isbn = superBook.isbn[that.isbnIdentifier];
        superBook.isbn[that.isbnIdentifier].forEach(function (isbn) {
            // check if there exist a book with a given isbn
            if (dump.hasOwnProperty(isbn)) {

                // create superBook reference
                dump[isbn].superBook = superBook._id;

                // change empty flag
                mergedBook.empty = false;

                // merge found book with openlib merged book
                mergedBook = new BookrCrawler.Book(that.merge(mergedBook, dump[isbn]));

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
                    uniqueVal,
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
;return BookrCrawler;
}));