'use strict';

// bootstrap required structures and load libraries
var _ = require('lodash'),
    Q = require('q'),
    Bookr = {},
    BookrCrawler = {
        _i: 0,
        version: '0.1.4',
        /**
         * @returns {Number}
         */
        uid: function () {
            this._i += 1;
            return this._i;
        },
        constants: {
            NO_ISBN_KEY: 'NO_ISBN_GIVEN'
        },
        Util: {}
    };

require('./util/bookUtil');

require('./util/variableType');

require('./model/book');
require('./model/superBook');
require('./provider/provider');

require('./common');

require('./merge/merger');