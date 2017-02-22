'use strict';

/**
 * Test case with default options (sort Map, Set, object keys and not sort arrays)
 */

const faker = require('faker');
const Benchmark = require('benchmark');

const hashit = require('..').hashit;

const params = {includePrimitiveTypes: true};

let testCases = {
    array: new Array(10).fill('sdfgsdfg'),
    object: {
        a: 'dfgsdfg'
    },
    nestedObject: deepThrow({
        a: 'rwter'
    }, 100),
    complexObject_5items: new Array(5).fill(1).reduce(acc => acc.concat(getFakeRealData()), []),
    complexObject_10items: new Array(10).fill(1).reduce(acc => acc.concat(getFakeRealData()), []),
    complexObject_100items: new Array(100).fill(1).reduce(acc => acc.concat(getFakeRealData()), []),
    set: new Set(['adfs', 'wer', 'sdf', 'bcvb', 'yutr']),
    map: new Map([['fgdsfg', 'rtyre'], ['adsasf', 'tyer'], ['dfgddf', 'rtyr']])
};

const testCasesNames = Object.keys(testCases);

console.log(`Warming up...`);
for (const caseName of testCasesNames) {
    warmUp(hashit, params, 1000, testCases[caseName]);
}

doCase(0);

function doCase(caseNameIndex) {
    gc();

    const caseName = testCasesNames[caseNameIndex];
    const testData = testCases[caseName];
    const suite = new Benchmark.Suite;

    if (!caseName) {
        return;
    }

    suite
        .add(caseName, function() {
            hashit(testData, params);
        })
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
        .on('complete', function() {
            doCase(caseNameIndex + 1);
        })
        .run({ async: true });
}

function warmUp(func, params, times, testData) {
    let result;

    while (times --> 0) {
        result = func(testData, params);
    }

    return result;
}

function deepThrow(object, depth) {
    while (depth --> 0) {
        let tmp = {
            object: object
        };
        object = tmp;
    }
    return object;
}

function getFakeRealData() {
    return {
        name: faker.name.firstName(),
        date: new Date(),
        address: {
            city: faker.address.city(),
            streetAddress: faker.address.streetAddress(),
            country: faker.address.country()
        },
        email: [
            faker.internet.email(),
            faker.internet.email(),
            faker.internet.email(),
            faker.internet.email()
        ],
        randoms: [
            faker.random.number(),
            faker.random.alphaNumeric(),
            faker.random.number(),
            faker.random.alphaNumeric(),
            faker.random.words(),
            faker.random.word()
        ],
        avatars: [
            {
                number: faker.random.number(),
                avatar: faker.internet.avatar()
            }, {
                number: faker.random.number(),
                avatar: faker.internet.avatar()
            }, {
                number: faker.random.number(),
                avatar: faker.internet.avatar()
            }, {
                number: faker.random.number(),
                avatar: faker.internet.avatar()
            }
        ]
    };
}
