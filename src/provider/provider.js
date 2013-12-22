/*global BookrCrawler */

(function (BookrCrawler) {
    'use strict';
    var providers = {};
    require('./google');
    require('./isbndb');
    require('./openlibrary');

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
