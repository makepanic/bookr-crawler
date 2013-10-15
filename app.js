/*global
 require
 */

'use strict';

var express = require('express'),
    http = require('http'),
    bookrCrawler = require('./dist/bookr-crawler.js'),
    app = express(),
    provider = [
        'google',
        'isbndb',
        'openlibrary'
    ];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.send('please us the /search/:provider api');
});

app.get('/search/:query', function (req, res) {
    var query = req.params.query,
        successCallback = function (response) {
            res.send(response);
        },
        errorCallback = function (message) {
            res.send('Error: ' + message);
        };

    if (query && typeof req.params.query === 'string') {
        // has valid query
        bookrCrawler.crawl({
            provider: provider,
            query: query,
            successCallback: successCallback,
            errorCallback: errorCallback
        });
    } else {
        // has invalid query
        res.send('Error');
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
