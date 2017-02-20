'use strict';

const faker = require('faker');
const Benchmark = require('benchmark');

const nodeObjectHashParams = {alg: 'md5', coerce: false};

const hashit = require('..').hashit;
const hashObject = require('hash-object');
const objectHash = require('object-hash').MD5;
const nodeObjectHash = require('node-object-hash')(nodeObjectHashParams).hash;

let testCases = {
    array: new Array(10).fill('sdfgsdfg'),
    object: {
        a: 'dfgsdfg'
    },
    nestedObject: deepThrow({
        a: 'rwter'
    }, 100),
    complexObject_5items: new Array(5).fill(1).map(getFakeRealData),
    complexObject_10items: new Array(10).fill(1).map(getFakeRealData),
    complexObject_100items: new Array(100).fill(1).map(getFakeRealData),

    // hashObject can't hash Map, Set and typed arrays
    // set: new Set(['adfs', 'wer', 'sdf', 'bcvb', 'yutr']),
    // map: new Map([['fgdsfg', 'rtyre'], ['adsasf', 'tyer'], ['dfgddf', 'rtyr']]),

};

let results = {};
const testCasesNames = Object.keys(testCases);

// node-object-hash only can toggle all sorts (arrays, maps, sets, object.keys) so we should sort arrays
const hashitParams = {sortArrays: true};

console.log(`Warming up...`);
for (const caseName of testCasesNames) {
    warmUp(hashit, hashitParams, 1000, testCases[caseName]);
    warmUp(nodeObjectHash, nodeObjectHashParams, 1000, testCases[caseName]);
    warmUp(hashObject, null, 1000, testCases[caseName]);
    warmUp(objectHash, null, 1000, testCases[caseName]);
}

doCase(0);

function doCase(caseNameIndex) {
    gc();

    const caseName = testCasesNames[caseNameIndex];
    const testData = testCases[caseName];
    const suite = new Benchmark.Suite;

    if (!caseName) {
        for (const key of Object.keys(results).sort((r1, r2) => results[r1].length < results[r2].length)) {
            console.log(`${key} faster in cases: ${results[key].join(', ')} (${results[key].length})`);
        }
        return;
    }

    console.log(`Benchmarking ${caseName} case...`);

    suite
        .add(`hashit/${caseName}`, function() {
            hashit(testData, hashitParams);
        })
        .add(`nodeObjectHash/${caseName}`, function () {
            nodeObjectHash(testData, nodeObjectHashParams);
        })
        .add(`hashObject/${caseName}`, function () {
            hashObject(testData);
        })
        .add(`objectHash/${caseName}`, function () {
            objectHash(testData);
        })
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
        .on('complete', function() {
            for (const name of this.filter('fastest').map('name')) {
                const lib = name.split('/')[0];
                if (!results[lib]) {
                    results[lib] = [caseName];
                } else {
                    results[lib].push(caseName);
                }
            }

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
