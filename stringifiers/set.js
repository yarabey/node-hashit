'use strict';

var stringify = require('../stringifier').stringify;

// Make sure Array.prototype[stringify] initialized
require('./array');

/**
 * @type {Stringifier~stringifyCallback}
 */
module.exports = Set.prototype[stringify] = WeakSet.prototype[stringify] = function (stringifier) {
    stringifier.string += 'set^';

    Array.from(this)[stringify](stringifier, true);
};
