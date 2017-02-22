'use strict';

var stringify = require('../stringifier').stringify;

/**
 * @type {Stringifier~stringifyCallback}
 */
module.exports = Object.prototype[stringify] = function (stringifier) {
    var keys = Object.keys(this).sort();

    stringifier.string += '{';

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        stringifier.string += key;
        stringifier.update(this[key], stringifier);
    }

    stringifier.string += '}';
};
