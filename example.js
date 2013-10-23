'use strict';
var bookrCrawler = require('./dist/bookr-crawler'),
    provider = [
        'google',
        'isbndb',
        'openlibrary'
    ],
    query = 'Masters of doom',
    result;

bookrCrawler.mergeCrawl({
    provider: provider,
    query: query,
    prefer: 'google'
}).then(function (result) {
    console.log('mergeSearch result', result);
});

