var Q = Q || require('q'),
    request = request || require('request'),
    providers = providers || {};

providers.google = function () {
    'use strict';

    var crawl,
        baseUrl = 'https://www.googleapis.com/books/v1/volumes?q=',
        bookConverter = function (item) {
            var volumeInfo = item.volumeInfo,
                searchInfo = item.searchInfo,
                book,
                data,
                imageLink;

            if (volumeInfo) {
                data = {
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
                        if (imageLink.substr(0, 5) === 'small') {
                            data.thumbnail.small = volumeInfo.imageLinks[volumeInfo];
                        } else {
                            data.thumbnail.normal = volumeInfo.imageLinks[volumeInfo];
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
                        books.push(bookConverter(item));
                    });

                } catch (e) {
                    console.error('Error parsing json. ' + e);
                }
            }
            deferred.resolve(books);
        });

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};