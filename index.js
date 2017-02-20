'use strict';

var crypto = require('crypto');
var Stringifier = require('./stringifier');

var stringify = Stringifier.stringify;
var stringifyit = Stringifier.stringifyit;

var DEFAULT_ALGORITHM = 'md5';
var DEFAULT_INPUT_ENCODING = 'utf8';
var DEFAULT_OUTPUT_ENCODING = 'hex';

/**
 * Provide interface to hash any value
 */
class Hasher {

    /**
     * @param [options] {Hasher~options}
     */
    constructor(options) {
        this.options = options || {};
        this.hasher = crypto.createHash(this.options.algorithm || DEFAULT_ALGORITHM);
    }

    /**
     * Updates hash with stringified value
     * @param value {*}
     * @param [inputEncoding] {string} Input encoding
     */
    update(value, inputEncoding) {
        this.hasher.update(
            stringifyit(value, this.options),
            inputEncoding || this.options.inputEncoding || DEFAULT_INPUT_ENCODING
        );
    }

    /**
     * @see {@link https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding}
     * @param [outputEncoding] {string} Output encoding
     * @returns {string}
     */
    digest(outputEncoding) {
        return this.hasher.digest(outputEncoding || this.options.outputEncoding || DEFAULT_OUTPUT_ENCODING);
    }

    /**
     * @see {@link https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding}
     * @returns {Buffer}
     */
    digestBuffer() {
        return this.hasher.digest();
    }
}

/**
 * Helper for simple hash single value
 *
 * @example
 * const {hashit} = require('node-hashit');
 *
 * hashit({key: 'value', value: 'key'}) === hashit({value: 'key', key: 'value'}); // true
 * hashit(new Set(['value1', 'value2'])) === hashit(new Set(['value2', 'value1'])); // true
 * hashit(new Map([['key', 'value'], ['value', 'key']])) === hashit(new Map([['value', 'key'], ['key', 'value']])); // true
 * hashit([1, 2, 3]) === hashit([1, 2, 3]); // true
 * hashit([1, 2, 3], {sortArrays: true}) === hashit([1, 3, 2], {sortArrays: true}); // true
 *
 * hashit([1, 2, 3]) === hashit([1, 3, 2]); // false
 * hashit(5) === hashit('5'); // false
 *
 * @param value {*}
 * @param [options] {Hasher~options}
 * @returns {string}
 */
function hashit(value, options) {
    var hasher = new Hasher(options);

    hasher.update(value);

    return hasher.digest();
}

module.exports = Hasher;
module.exports.hashit = hashit;
module.exports.Stringifier = Stringifier;
module.exports.stringifyit = stringifyit;
module.exports.stringify = stringify;

/**
 * @typedef {Stringifier~options} Hasher~options
 * @property {string} [algorithm=md5] Hash algorithm
 * @property {string} [inputEncoding=utf8] Input encoding
 * @property {string} [outputEncoding=hex] Output encoding
 * @see {@link https://nodejs.org/api/crypto.html#crypto_class_hash}
 */
