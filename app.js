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
    var query = req.params.query;

    if (query && typeof req.params.query === 'string') {
        // has valid query

        // crawl given provider with query
        bookrCrawler.crawl({
            provider: provider,
            query: query
        }).then(function (data) {
            var merger = new bookrCrawler.Merger('google'),
                merged,
                openLibData,
                easyMergeData;

            // filter special provider
            easyMergeData = data.filter(function (data) {
                var easyMerge = true;
                if (data.key === 'openlibrary') {
                    openLibData = data;
                    easyMerge = false;
                }
                return easyMerge;
            });

            // simple merge books
            merged = merger.mergeBooks(easyMergeData);

            // merge via openlibrary results
            merged = merger.mergeByOpenLibrarySearch(merged, openLibData);

            // remove unused properties
            merged = merger.finalize(merged);

            // send result
            res.send(merged);
        });
    } else {
        // has invalid query
        res.send('Error');
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
