
/**
 * Main method to crawl given provider
 * @param currentCfg
 * @returns {*} Promise
 */
BookrCrawler.crawl = function (currentCfg) {
    var deferred = Q.defer(),
        defaultCfg = {
            provider: [],
            query: ''
        },
        cfg = _.extend(defaultCfg, currentCfg),
        provider = cfg.provider,
        query = cfg.query,
        promises = [];

    provider.forEach(function (p) {
        // push crawl promise of every provider
        promises.push(BookrCrawler.Provider(p).crawl(query));
    });

    // execute all provider crawl promises
    Q.all(promises).then(function (results) {
        deferred.resolve(results);
    });

    return deferred.promise;
};

/**
 * Method that combines the crawl function and merges the results afterwards
 * @param currentCfg
 * @returns {*} merged map of books
 */
BookrCrawler.mergeCrawl = function (currentCfg) {
    var defaultCfg = {
            provider: [],
            query: '',
            prefer: 'google'
        },
        cfg = _.extend(defaultCfg, currentCfg);

    return this.crawl({
        provider: cfg.provider,
        query: cfg.query
    }).then(function (data) {
        var merger = new BookrCrawler.Merger(cfg.prefer),
            deferred = Q.defer(),
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

        setTimeout(function () {
            deferred.resolve(merged);
        }, 14);

        return deferred.promise;
    });
};