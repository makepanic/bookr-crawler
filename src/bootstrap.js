'use strict';

var _ = require('lodash'),
    Q = require('q'),
    BookrCrawler = {
        _i: 0,
        version: '0.0.1',
        uid: function () {
            this._i += 1;
            return this._i;
        },
        constants: {
            NO_ISBN_KEY: 'NO_ISBN_GIVEN'
        },
        available: {
            'google': true,
            'isbndb': true,
            'openlibrary': true
        }
    };

require('./util/bookUtil');
require('./util/variableType');
require('./model/book');
require('./provider/provider');

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
        promises.push(BookrCrawler.Provider(p).crawl(query));
    });
    Q.all(promises).then(function (results) {
        deferred.resolve(results);
    });

    return deferred.promise;
};

require('./merger');