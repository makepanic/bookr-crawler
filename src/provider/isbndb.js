var Q = Q || require('q'),
    request = request || require('request'),
    providers = providers || {};

providers.isbndb = function () {
    var crawl;

    crawl = function () {
        var deferred = Q.defer();

        deferred.resolve('TODO: isbndb');

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};