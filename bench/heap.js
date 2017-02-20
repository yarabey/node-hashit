'use strict';

const faker = require('faker');

const nodeObjectHashParams = {alg: 'md5', coerce: false};

const hashit = require('..').hashit;
const hashObject = require('hash-object');
const objectHash = require('object-hash').MD5;
const nodeObjectHash = require('node-object-hash')(nodeObjectHashParams).hash;

let testCases = {
    nestedObject: deepThrow({
        a: 'rwter'
    }, 100),
    complexObject1: new Array(100000).fill(1).map(getFakeRealData),
    complexObject2: new Array(100000).fill(1).map(getFakeRealData),
    complexObject3: new Array(100000).fill(1).map(getFakeRealData),
    complexObject4: new Array(100000).fill(1).map(getFakeRealData),
};

// node-object-hash only can toggle all sorts (arrays, maps, sets, object.keys) so we should sort arrays
const hashitParams = {sortArrays: true};

console.log(`Warming up...`);
for (const complexObject of new Array(10000).fill(1).map(getFakeRealData)) {
    warmUp(hashit, hashitParams, 1, complexObject);
    warmUp(nodeObjectHash, nodeObjectHashParams, 1, complexObject);
    warmUp(hashObject, null, 1, complexObject);
    warmUp(objectHash, null, 1, complexObject);
}


console.log('Collecting garbage...');
gc();

var memStats;
var memMaxHeap = 0;
var memHeapStart;
var bigHash;

console.log('Starting benchmark...');

memStats = process.memoryUsage();
memHeapStart = memStats.heapUsed;
console.time('hashit');
testCases.complexObject1.forEach((it, idx) => {
    it.hash = hashit(it, hashitParams);
    if (idx % 10000 === 0) {
        memStats = process.memoryUsage();
        if (memMaxHeap < memStats.heapUsed) {
            memMaxHeap = memStats.heapUsed;
        }
        console.log(`${idx} items processed: RSS:${Math.round(memStats.rss / (1024 * 1024))}Mb / HEAP: ${Math.round(memStats.heapUsed / (1024 * 1024))}Mb`)
    }
});
bigHash = hashit(testCases.nestedObject, hashitParams);
console.log(bigHash);
console.timeEnd('hashit');
memStats = process.memoryUsage();
memMaxHeap = memMaxHeap < memStats.heapUsed ? memStats.heapUsed : memMaxHeap;
console.log(`Memory footprint:\n MAX HEAP DIFF:${Math.round((memMaxHeap - memHeapStart) / (1024 * 1024))}Mb`);

console.log('Collecting garbage...');
gc();
memMaxHeap = 0;

memStats = process.memoryUsage();
memHeapStart = memStats.heapUsed;
console.time('node-object-hash');
testCases.complexObject2.forEach((it, idx) => {
    it.hash = nodeObjectHash(it, nodeObjectHashParams);
    if (idx % 10000 === 0) {
        memStats = process.memoryUsage();
        if (memMaxHeap < memStats.heapUsed) {
            memMaxHeap = memStats.heapUsed;
        }
        console.log(`${idx} items processed: RSS:${Math.round(memStats.rss / (1024 * 1024))}Mb / HEAP: ${Math.round(memStats.heapUsed / (1024 * 1024))}Mb`)
    }
});
bigHash = nodeObjectHash(testCases.nestedObject, nodeObjectHashParams);
console.log(bigHash);
console.timeEnd('node-object-hash');
memStats = process.memoryUsage();
memMaxHeap = memMaxHeap < memStats.heapUsed ? memStats.heapUsed : memMaxHeap;
console.log(`Memory footprint:\n MAX HEAP DIFF:${Math.round((memMaxHeap - memHeapStart) / (1024 * 1024))}Mb`);

console.log('Collecting garbage...');
gc();
memMaxHeap = 0;

memStats = process.memoryUsage();
memHeapStart = memStats.heapUsed;
console.time('hash-object');
var hashObjectOpts = {algorithm: 'sha256'};
testCases.complexObject3.forEach((it, idx) => {
    it.hash = hashObject(it, hashObjectOpts);
    if (idx % 10000 === 0) {
        memStats = process.memoryUsage();
        if (memMaxHeap < memStats.heapUsed) {
            memMaxHeap = memStats.heapUsed;
        }
        console.log(`${idx} items processed: RSS:${Math.round(memStats.rss / (1024 * 1024))}Mb / HEAP: ${Math.round(memStats.heapUsed / (1024 * 1024))}Mb`)
    }
});
bigHash = hashObject(testCases.nestedObject, hashObjectOpts);
console.log(bigHash);
console.timeEnd('hash-object');
memStats = process.memoryUsage();
memMaxHeap = memMaxHeap < memStats.heapUsed ? memStats.heapUsed : memMaxHeap;
console.log(`Memory footprint:\n MAX HEAP DIFF:${Math.round((memMaxHeap - memHeapStart) / (1024 * 1024))}Mb`);

console.log('Collecting garbage...');
gc();
memMaxHeap = 0;

memStats = process.memoryUsage();
memHeapStart = memStats.heapUsed;
console.time('object-hash');
testCases.complexObject4.forEach((it, idx) => {
    it.hash = objectHash(it, {algorithm: 'sha256', encoding: 'hex', unorderedArrays: true});
    if (idx % 10000 === 0) {
        memStats = process.memoryUsage();
        if (memMaxHeap < memStats.heapUsed) {
            memMaxHeap = memStats.heapUsed;
        }
        console.log(`${idx} items processed: RSS:${Math.round(memStats.rss / (1024 * 1024))}Mb / HEAP: ${Math.round(memStats.heapUsed / (1024 * 1024))}Mb`)
    }
});
bigHash = objectHash(testCases.nestedObject, {algorithm: 'sha256', encoding: 'hex', unorderedArrays: true});
console.log(bigHash);
console.timeEnd('object-hash');
memStats = process.memoryUsage();
memMaxHeap = memMaxHeap < memStats.heapUsed ? memStats.heapUsed : memMaxHeap;
console.log(`Memory footprint:\n MAX HEAP DIFF:${Math.round((memMaxHeap - memHeapStart) / (1024 * 1024))}Mb`);

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
