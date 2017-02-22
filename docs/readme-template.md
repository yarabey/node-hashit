# node-hashit
Fast node.js hash library with sorting and typing. Provide [Hasher](#Hasher) and [Stringifier](#Stringifier) classes. [Stringifier](#Stringifier) provide [stringify Symbol](#stringifierstringify--symbol) to allow you [customize](#stringifierstringifycallback--function) stringifying your own classes.

Using node.js `crypto` module. For browsers you can use [crypto-browserify](https://github.com/crypto-browserify/crypto-browserify) or only [Stringifier](#Stringifier) class.

See [benchmarks](#benchmarks) for compare to other libs.

# Install
`npm i node-hashit --save`

# Features

- Supports node.js >= 4.0.0
- Supports Map/WeakMap, Set/WeakSet and typed arrays
- Supports algorithms and encodings from node.js `crypto` module
- Supports sort Set, Map, object keys and optional sort arrays
- Supports custom hash rules for user-defined classes
- One of the fastest hash libraries

# API

{{>main}}

## Custom stringifiers [source](stringifiers)

### Object.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### Array.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### TypedArray.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### Map.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### WeakMap.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### Set.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### WeakSet.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>
### Date.prototype[[stringify](#Stringifier..stringify)] : <code>[stringifyCallback](#Stringifier..stringifyCallback)</code>

# Benchmarks

Benchmarked with Node.js v6.9.5

## Usage

* `npm run benchOps` to run comparison operations/second with other libs for different cases
* `npm run benchHeap` to run comparison heap using with other libs for complex cases
* `npm run benchSpeed` to run benchmarking hashit operations/second for different cases

## Results

### Operations/second comparison (+includePrimitiveTypes +sortArrays) [source](bench/ops.js)

```
hashit/array x 255,710 ops/sec ±1.54% (86 runs sampled)
nodeObjectHash/array x 174,084 ops/sec ±2.11% (84 runs sampled)
hashObject/array x 140,706 ops/sec ±1.56% (82 runs sampled)
objectHash/array x 48,767 ops/sec ±1.55% (88 runs sampled)

hashit/object x 426,051 ops/sec ±1.18% (82 runs sampled)
nodeObjectHash/object x 354,923 ops/sec ±1.59% (83 runs sampled)
hashObject/object x 350,324 ops/sec ±1.40% (84 runs sampled)
objectHash/object x 27,030 ops/sec ±1.39% (83 runs sampled)

hashit/nestedObject x 22,024 ops/sec ±1.31% (87 runs sampled)
nodeObjectHash/nestedObject x 16,252 ops/sec ±4.74% (81 runs sampled)
hashObject/nestedObject x 17,689 ops/sec ±1.92% (85 runs sampled)
objectHash/nestedObject x 657 ops/sec ±1.27% (84 runs sampled)

hashit/complexObject_5items x 18,813 ops/sec ±1.56% (86 runs sampled)
nodeObjectHash/complexObject_5items x 9,922 ops/sec ±1.58% (87 runs sampled)
hashObject/complexObject_5items x 2,561 ops/sec ±1.65% (84 runs sampled)
objectHash/complexObject_5items x 1,433 ops/sec ±1.37% (85 runs sampled)

hashit/complexObject_10items x 9,893 ops/sec ±1.57% (86 runs sampled)
nodeObjectHash/complexObject_10items x 4,906 ops/sec ±2.10% (86 runs sampled)
hashObject/complexObject_10items x 1,331 ops/sec ±1.21% (85 runs sampled)
objectHash/complexObject_10items x 722 ops/sec ±1.65% (82 runs sampled)

hashit/complexObject_100items x 924 ops/sec ±1.68% (84 runs sampled)
nodeObjectHash/complexObject_100items x 483 ops/sec ±1.72% (84 runs sampled)
hashObject/complexObject_100items x 129 ops/sec ±1.35% (70 runs sampled)
objectHash/complexObject_100items x 66.61 ops/sec ±1.44% (65 runs sampled)

hashit faster in cases: array, object, nestedObject, complexObject_5items, complexObject_10items, complexObject_100items (6)

```

### Heap using comparison  (+includePrimitiveTypes +sortArrays) [source](bench/heap.js)

| Library                               | Time (ms)  | Memory (Mb)        |
|---------------------------------------|------------|--------------------|
| hashit-0.1.0                          | 2150.435   | 42                 |
| node-object-hash-1.2.0                | 2635.670   | 39                 |
| object-hash-1.1.5                     | 17325.391  | 62                 |
| hash-object-0.1.7                     | 9762.324   | 51                 |

### Operations/second hashit benchmarking (+includePrimitiveTypes -sortArrays) [source](bench/speed.js)

```
array x 363,314 ops/sec ±1.37% (84 runs sampled)
object x 429,485 ops/sec ±1.29% (85 runs sampled)
nestedObject x 22,396 ops/sec ±1.19% (85 runs sampled)
complexObject_5items x 18,482 ops/sec ±1.51% (86 runs sampled)
complexObject_10items x 9,729 ops/sec ±1.51% (84 runs sampled)
complexObject_100items x 896 ops/sec ±1.78% (83 runs sampled)
set x 115,158 ops/sec ±1.93% (83 runs sampled)
map x 110,525 ops/sec ±1.92% (83 runs sampled)
```

## Links

* [node-object-hash](https://www.npmjs.com/package/node-object-hash) - Fast hasher with nice interface
* [object-hash](https://www.npmjs.com/package/object-hash) - Slow but popular hash lib, supports browser using
* [hash-object](https://www.npmjs.com/package/hash-object) - Old and not supporting lib, but useful for simple objects


# License
MIT
