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