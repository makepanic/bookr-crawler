var Q = Q || require('q'),
    request = request || require('request'),
    nconf = nconf || require('nconf'),
    providers = providers || {},
    isbndb;

nconf.file({ file: 'config.json' });

isbndb = nconf.get('isbndb');

providers.isbndb = function () {
    'use strict';

    var crawl,
        baseUrl = 'http://isbndb.com/api/v2/json/' + isbndb.key + '/books?q=',
        bookConverter = function (item) {
            var book,
                data;

            data = {
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
                    responseData.data.forEach(function (item) {
                        books.push(bookConverter(item));
                    });
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