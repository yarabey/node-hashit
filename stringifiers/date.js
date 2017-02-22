'use strict';

var stringify = require('../stringifier').stringify;

/**
 * @type {Stringifier~stringifyCallback}
 */
module.exports = Date.prototype[stringify] = function (stringifier) {
    stringifier.string += `date^${String(this.getTime())}`;
};
