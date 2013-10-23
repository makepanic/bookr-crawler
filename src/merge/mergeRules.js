/**
 * Rules for merging 2 values.
 * @type {{array: Function, string: Function, object: Function}}
 */
BookrCrawler.Merger.mergeRules = {
    'array': function (a, b) {
        'use strict';

        var concat = a.concat(b);

        // via http://stackoverflow.com/a/9229821
        return concat.filter(function (elem, pos) {
            return concat.indexOf(elem) === pos;
        });
    },
    'string': function (a, b) {
        'use strict';
        var merged = '';
        if ((a === undefined || b === undefined) && a !== b) {
            merged = a || b;
        } else {
            merged = a.length > b.length ? a : b;
        }

        return merged;
    },
    'object': function (a, b) {
        'use strict';
        var src,
            dest,
            key,
            type;

        if (Object.keys(a).length > Object.keys(b).length) {
            // a has more properties
            dest = b;
            src = a;
        } else {
            // b has more or equal properties
            dest = a;
            src = b;
        }

        for (key in src) {
            if (src.hasOwnProperty(key)) {

                if (dest.hasOwnProperty(key)) {
                    type = BookrCrawlerUtil.Type.getType(src[key]);

                    dest[key] = BookrCrawler.Merger.mergeRules[type](dest[key], src[key]);
                } else {
                    dest[key] = src[key];
                }
            }
        }

        return dest;
    }
};