'use strict';
var bookrCrawler = require('./dist/bookr-crawler'),
    provider = [
        'google',
        'isbndb',
        'openlibrary'
    ],
    query = 'Masters of doom';

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
    merged = merger.mergeOpenLibrary(merged, openLibData);

    // remove unused properties
    merged = merger.finalize(merged);

    // send result
    console.log('search result', merged);
});