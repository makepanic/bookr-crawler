var bookrCrawler = require('../../dist/bookr-crawler'),
    testUtils = require('../testUtils');

/**
 * test for book merger mergeBooks method
 * @param test
 */

exports.testMergeRules = function (test) {
    // create merger with google preference
    var merger = new bookrCrawler.Merger('google'),
        rules = {
            array: bookrCrawler.Merger.mergeRules.array,
            string: bookrCrawler.Merger.mergeRules.string,
            object: bookrCrawler.Merger.mergeRules.object
        };

    test.equal(rules.string('', 's2'), 's2', 'string #1');
    test.equal(rules.string('s1', 's2-longer'), 's2-longer', 'string #2');
    test.equal(rules.string('s1', 's2'), 's2', 'string #3');
    test.equal(rules.string('s1-longer', 's2', true), 's2', 'string #4');
    test.equal(rules.string('s1-longer', '', true), 's1-longer', 'string #5');

    test.deepEqual(rules.array([], ['a2']), ['a2'], 'array #1');
    test.deepEqual(rules.array(['a1'], []), ['a1'], 'array #2');
    test.deepEqual(rules.array(['a1'], ['a2']), ['a1', 'a2'], 'array #3');
    test.deepEqual(rules.array(['a2'], ['a1']), ['a2', 'a1'], 'array #4 - array order');
    test.deepEqual(rules.array(['a1', 'a2'], ['a1']), ['a1', 'a2'], 'array #5 - duplicated entries');

    test.deepEqual(rules.object({
        foo: '',
        arr: []
    }, {
        foo: 's2',
        arr: ['a2']
    }), {
        foo: 's2',
        arr: ['a2']
    }, 'object #1');
    test.deepEqual(rules.object({
        foo: 's1',
        arr: ['a1']
    }, {
        foo: '',
        arr: []
    }), {
        foo: 's1',
        arr: ['a1']
    }, 'object #2');
    test.deepEqual(rules.object({
        foo: 's1',
        arr: ['a1']
    }, {
        foo: 's2-longer',
        arr: ['a2']
    }), {
        foo: 's2-longer',
        arr: ['a1', 'a2']
    }, 'object #3');
    test.deepEqual(rules.object({
        foo: 's1',
        arr: ['a2']
    }, {
        foo: 's2',
        arr: ['a1']
    }), {
        foo: 's2',
        arr: ['a2', 'a1']
    }, 'object #4');
    test.deepEqual(rules.object({
        foo: 's1-longer',
        arr: ['a1', 'a2']
    }, {
        foo: 's2',
        arr: ['a1']
    }, true), {
        foo: 's2',
        arr: ['a1', 'a2']
    }, 'object #5');

    test.done();
};