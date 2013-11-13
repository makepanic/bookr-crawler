'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Bookr = {},
    BookrCrawler = {
        _i: 0,
        version: '0.1.4',
        uid: function () {
            this._i += 1;
            return this._i;
        },
        constants: {
            NO_ISBN_KEY: 'NO_ISBN_GIVEN'
        },
        Util: {}
    };

require('./util/asyncHelper');
require('./util/bookUtil');

require('./util/variableType');

require('./model/book');
require('./provider/provider');

require('./common');

require('./merge/merger');