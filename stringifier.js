'use strict';

var SlowBuffer = require('buffer').SlowBuffer;

/**
 * @type {Stringifier~stringify}
 */
var stringify = Symbol('stringify');

/**
 * Provide interface to stringify any value
 * Sort Map and Set by default without ability to avoid it
 */
class Stringifier {

    /**
     * @param [options] {Stringifier~options}
     */
    constructor(options) {
        this.string = '';
        this.options = options || {};
    }

    /**
     * Stringifies value and append it to current accumulator string
     * @param value {*}
     */
    update(value) {
        this._stringify(value);
    }

    /**
     * Returns accumulator string
     * @returns {string}
     */
    getString() {
        return this.string;
    }

    /**
     * Stringifies value by type/constructor
     * @param value {*}
     * @private
     */
    _stringify(value) {
        var type = typeOf(value);

        if (type !== 'object') {
            return this._stringifyOther(value, type);
        }

        switch (value.constructor) {
            case Date:
                this._stringifyDate(value);
                break;
            case Array:
            case Int8Array:
            case Uint8Array:
            case Uint8ClampedArray:
            case Int16Array:
            case Uint16Array:
            case Int32Array:
            case Uint32Array:
            case Float32Array:
            case Float64Array:
            case Buffer:
            case SlowBuffer:
                this._stringifyArray(value);
                break;
            case Set:
            case WeakSet:
                this._stringifySet(value);
                break;
            case Map:
            case WeakMap:
                this._stringifyMap(value);
                break;
            default:
                this._stringifyObject(value);
        }
    }

    /**
     * Stringifies value with type
     * @param value {number|string|boolean|symbol|function|null|undefined}
     * @param type {string}
     * @private
     */
    _stringifyOther(value, type) {
        this._appendString(`${type[0]}:${String(value)}`);
    }

    /**
     * @param map {Map}
     * @private
     */
    _stringifyMap(map) {
        this._appendString('[[');
        var array = [];
        var mapArray = Array.from(map);
        for (var i = 0; i < mapArray.length; i++) {
            var item = mapArray[i];
            array.push([
                stringifyit(item[0]),
                stringifyit(item[1])
            ]);
        }
        this._appendString(array.sort(compareMapItems).join(''));
        this._appendString(']]');
    }

    /**
     *
     * @param array {Array} Array or typed array
     * @param [forceSort] {boolean} Sort array, if true ignore sortArrays options (using for Set)
     * @private
     */
    _stringifyArray(array, forceSort) {
        var index = array.length;

        this._appendString('[');

        if (forceSort || this.options.sortArrays) {
            var arrayOfStrings = [];
            while (index --> 0) {
                arrayOfStrings.push(stringifyit(array[index]));
            }
            this._appendString(arrayOfStrings.sort().join(''));
        } else {
            while (index --> 0) {
                this._stringify(array[index]);
            }
        }
        this._appendString(']');
    }

    /**
     * @param set {Set}
     * @private
     */
    _stringifySet(set) {
        this._appendString('s:');

        this._stringifyArray(Array.from(set), true);
    }

    /**
     * @param date {Date}
     * @private
     */
    _stringifyDate(date) {
        this._stringifyOther(date.getTime(), 'date');
    }

    /**
     * @param object {Object}
     * @private
     */
    _stringifyObject(object) {
        if (object[stringify]) {
            object[stringify](value => this.update(value), this.options, object);
        } else {
            var keys = Object.keys(object).sort();

            this._appendString('{');

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];

                this._appendString(key);
                this._stringify(object[key]);
            }

            this._appendString('}');
        }
    }

    /**
     * Appends string to accumulator
     * @param string {string}
     * @private
     */
    _appendString(string) {
        this.string += string;
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

    return stringifier.getString();
}

module.exports = Stringifier;
module.exports.stringify = stringify;
module.exports.stringifyit = stringifyit;

/**
 * Custom typeof, returns 'null' for null object
 * @param value {*}
 * @returns {string}
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
 * Helper to compare two Map items
 * @param item1 {string[][]}
 * @param item2 {string[][]}
 * @returns {boolean}
 */
function compareMapItems(item1, item2) {
    var key1 = item1[0];
    var key2 = item2[0];

    if (key1 === key2) {
        return item1[1] > item2[2];
    }

    return key1 > key2;
}

/**
 * Custom stringify callback declared with {@link Stringifier~stringify stringify Symbol}
 *
 * @example
 * const {stringify} = require('node-hashit');
 * CustomType.prototype[stringify] = function (update) {
 *     update(this.someProp);
 *     update(['use', 'any', 'type']);
 * }
 *
 * @callback Stringifier~stringifyCallback
 * @param {function} update Stringifier#update method
 * @param {Stringifier~options} options Stringifier#options
 * @param {Object} object Currently stringifying object (`this` in callback)
 */

/**
 * Symbol to add custom stringify rules for user types
 * @typedef {Symbol} Stringifier~stringify
 */

/**
 * Stringifier options
 * @typedef {Object} Stringifier~options
 * @property {boolean} [sortArrays] Sort arrays before stringify
 */
