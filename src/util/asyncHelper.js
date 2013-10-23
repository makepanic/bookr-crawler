// provide namespace
var Bookr = Bookr || {},
    Q = Q || require('q');

Bookr.AsyncHelper = {
    wrapInPromise: function (callback) {
        'use strict';

        var defer = Q.defer();

        callback(defer);

        return defer.promise;

    }
}