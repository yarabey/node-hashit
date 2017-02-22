'use strict';

/**
 * @type {Stringifier~stringify}
 */
var stringify = Symbol('stringify');

/**
 * Provides interface to stringify any value
 * Sort Map, Set and object keys by default without ability to avoid it
 */
class Stringifier {

    /**
     * @param [options] {Stringifier~options}
     */
    constructor(options) {

        /**
         * Accumulator string
         * @type {string}
         * @public
         */
        this.string = '';

        this.options = options || {};
    }

    /**
     * Stringifies value and append it to current accumulator string
     * @param value {*}
     */
    update(value) {
        var type = typeOf(value);

        if (type !== 'object') {
            if (this.options.includePrimitiveTypes) {
                this.string += `${type[0]}^`;
            }

            this.string += String(value);
        } else if (value[stringify]) {
            if (this.options.includeConstructorNames) {
                this.string += value.constructor.name;
            }

            value[stringify](this);
        } else {
            Object.prototype[stringify].call(value, this);
        }
    }
}

/**
 * Helper for simple stringify single value
 *
 * @example
 * const {stringifyit} = require('node-hashit');
 *
 * stringifyit({key: 'value', value: 'key'}) === stringifyit({value: 'key', key: 'value'}); // true
 * stringifyit(new Set(['value1', 'value2'])) === stringifyit(new Set(['value2', 'value1'])); // true
 * stringifyit(new Map([['key', 'value'], ['value', 'key']])) === stringifyit(new Map([['value', 'key'], ['key', 'value']])); // true
 * stringifyit([1, 2, 3]) === stringifyit([1, 2, 3]); // true
 * stringifyit([1, 2, 3], {sortArrays: true}) === stringifyit([1, 3, 2], {sortArrays: true}); // true
 *
 * stringifyit([1, 2, 3]) === stringifyit([1, 3, 2]); // false
 * stringifyit(5) === stringifyit('5'); // false
 *
 * @param value {*}
 * @param [options] {Stringifier~options}
 * @returns {string}
 */
function stringifyit(value, options) {
    var stringifier = new Stringifier(options);

    stringifier.update(value);

    return stringifier.string;
}

module.exports = Stringifier;
module.exports.stringify = stringify;
module.exports.stringifyit = stringifyit;

/**
 * Loading custom stringifiers for object instances
 * There is circular dependency
 */
require('./stringifiers');

/**
 * Custom typeof, returns `'null'` for `null` object
 * @param value {*}
 * @returns {string}
 * @private
 */
function typeOf(value) {
    var type = typeof value;

    return type === 'object' ? typeOfObject(value) : type;
}

function typeOfObject(object) {
    if (object === null) {
        return 'null';
    }

    return object === null ? 'null' : 'object';
}

/**
 * Custom stringify callback declared with {@link Stringifier~stringify stringify Symbol}
 *
 * @example
 * const {stringify} = require('node-hashit');
 * CustomType.prototype[stringify] = function (stringifier) {
 *     stringifier.string += 'start';
 *
 *     stringifier.update(this.someProp);
 *     stringifier.update(['use', 'any', 'type']);
 *
 *     stringifier.string += 'end';
 * }
 *
 * @callback Stringifier~stringifyCallback
 * @param {Stringifier} stringifier Stringifier instance
 */

/**
 * Symbol to add custom stringify rules for user types
 * @typedef {Symbol} Stringifier~stringify
 */

/**
 * Stringifier options
 * @typedef {Object} Stringifier~options
 * @property {boolean} [sortArrays] Sort arrays before stringify
 * @property {boolean} [includePrimitiveTypes] Stringify primitive values (and functions) types
 * @property {boolean} [includeConstructorNames] Stringify non-primitive values constructor names
 */
