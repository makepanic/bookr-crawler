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
        }
    };

require('./util/bookUtil');
require('./util/variableType');
require('./model/book');
require('./provider/provider');

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

require('./merger');