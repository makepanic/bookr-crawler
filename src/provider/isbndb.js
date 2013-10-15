var Q = require('q'),
    providers = providers || {};

providers.isbndb = function () {
    var crawl;

    crawl = function () {
        var deferred = Q.defer();

        deferred.resolve('done');

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};