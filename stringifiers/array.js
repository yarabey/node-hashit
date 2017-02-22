'use strict';

var Stringifier = require('../stringifier');

var stringify = Stringifier.stringify;
var stringifyit = Stringifier.stringifyit;

Array.prototype[stringify] = stringifyArray;
Int8Array.prototype[stringify] = stringifyArray;
Uint8Array.prototype[stringify] = stringifyArray;
Uint8ClampedArray.prototype[stringify] = stringifyArray;
Int16Array.prototype[stringify] = stringifyArray;
Uint16Array.prototype[stringify] = stringifyArray;
Int32Array.prototype[stringify] = stringifyArray;
Uint32Array.prototype[stringify] = stringifyArray;
Float32Array.prototype[stringify] = stringifyArray;
Float64Array.prototype[stringify] = stringifyArray;

module.exports = stringifyArray;

/**
 * @type {Stringifier~stringifyCallback}
 * @param [forceSort] {boolean} Sort array, if true ignore sortArrays options
 */
function stringifyArray(stringifier, forceSort) {
    var index = this.length;

    stringifier.string += '[';

    if (forceSort || stringifier.options.sortArrays) {
        var arrayOfStrings = [];
        while (index --> 0) {
            arrayOfStrings.push(stringifyit(this[index]));
        }
        stringifier.string += arrayOfStrings.sort().join('');
    } else {
        while (index --> 0) {
            stringifier.update(this[index], stringifier);
        }
    }

    stringifier.string += ']';
}
