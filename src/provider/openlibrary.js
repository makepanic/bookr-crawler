var Q = Q || require('q'),
    request = request || require('request'),
    nconf = nconf || require('nconf'),
    providers = providers || {};

providers.openlibrary = function () {
    var crawl;

    crawl = function () {
        var deferred = Q.defer();

        deferred.resolve({
            data: 'TODO',
            key: 'openlibrary'
        });

        return deferred.promise;
    };

    return {
        crawl: crawl
    };
};