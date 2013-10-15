'use strict';

var _ = require('lodash'),
    Q = require('q'),
    BookrCrawler = {
        version: '0.0.1',
        available: {
            'google': true,
            'isbndb': true,
            'openlibrary': true
        }
    };

require('./model/book');
require('./provider/provider');

BookrCrawler.crawl = function (currentCfg) {
    var defaultCfg = {
            provider: [],
            query: '',
            successCallback: function (data) {

            },
            errorCallback: function () {
                throw 'Error';
            }
        },
        cfg = _.extend(defaultCfg, currentCfg),
        provider = cfg.provider,
        query = cfg.query,
        promises = [];

    provider.forEach(function (p) {
        promises.push(BookrCrawler.Provider(p).crawl(query));
    });
    Q.all(promises).then(function (results) {
        console.log('success', results);
        cfg.successCallback(results);
    });
};