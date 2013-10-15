var Q = Q || require('q'),
    request = request || require('request'),
    providers = providers || {};

providers.openlibrary = function () {
    var crawl;

    crawl = function () {
        var deferred = Q.defer();

        deferred.resolve('TODO: openlibrary');

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};