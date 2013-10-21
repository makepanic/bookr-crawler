var BookrCrawlerUtil = BookrCrawlerUtil || {};
(function (BookrCrawlerUtil) {
    'use strict';

    var types,
        checkFn,
        typesReverse;

    checkFn = function (val) {
        return Object.prototype.toString.call(val);
    };

    typesReverse = {
        '[object Array]': 'array',
        '[object Function]': 'function',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Object]': 'object',
        '[object Boolean]': 'boolean'
    };

    types = {
        /**
         * Checks if a value is an array
         * @param val {*}
         * @returns {boolean}
         */
        'array': function (val) {
            return checkFn(val) === '[object Array]';
        },
        /**
         * Checks if a value is a function
         * @param val {*}
         * @returns {boolean}
         */
        'function': function (val) {
            return checkFn(val) === '[object Function]';
        },

        /**
         * Checks if a value is a number
         * @param val
         * @returns {boolean}
         */
        'number': function (val) {
            return !isNaN(val) && checkFn(val) === '[object Number]';
        },

        /**
         * Checks if a value is a string
         * @param val
         * @returns {boolean}
         */
        'string': function (val) {
            return checkFn(val) === '[object String]';
        },

        /**
         * Checks if a value is a object
         * @param val
         * @returns {boolean}
         */
        'object': function (val) {
            return checkFn(val) === '[object Object]';
        },

        /**
         * Checks if a value is a boolean
         * @param val
         * @returns {boolean}
         */
        'boolean': function (val) {
            return checkFn(val) === '[object Boolean]';
        }
    };

    BookrCrawlerUtil.Type = {
        /**
         * Checks if a value is of a given type
         * @param type {string}
         * @param value {*}
         * @returns {*} true if is of type
         */
        is: function (type, value) {
            var is;
            if (types.hasOwnProperty(type)) {
                is = types[type](value);
            }
            return is;
        },

        getType: function (value) {
            var toString = checkFn(value);
            return types[typesReverse[toString]](value) ? typesReverse[toString] : undefined;
        }
    };
}(BookrCrawlerUtil));