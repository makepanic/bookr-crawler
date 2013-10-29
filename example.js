'use strict';
var bookrCrawler = require('./dist/bookr-crawler'),
    provider = [
        'google',
        'isbndb',
        'openlibrary'
    ],
    query = 'Masters of Doom',
    result;

bookrCrawler.mergeCrawl({
    provider: provider,
    query: query,
    prefer: 'google'
}).then(function (result) {
    console.log('mergeSearch result', JSON.stringify(result));
});

