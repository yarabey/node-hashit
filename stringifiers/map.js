'use strict';

var Stringifier = require('../stringifier');

var stringify = Stringifier.stringify;
var stringifyit = Stringifier.stringifyit;

/**
 * @type {Stringifier~stringifyCallback}
 */
module.exports = Map.prototype[stringify] = WeakMap.prototype[stringify] = function (stringifier) {
    var array = [];
    var mapArray = Array.from(this);

    stringifier.string += 'map^[[';

    for (var i = 0; i < mapArray.length; i++) {
        var item = mapArray[i];
        array.push([
            stringifyit(item[0]),
            stringifyit(item[1])
        ]);
    }
    stringifier.string += `${array.sort(compareMapItems).join('')}]]`;
};

/**
 * Helper to compare two Map items
 * @param item1 {string[][]}
 * @param item2 {string[][]}
 * @returns {number}
 * @private
 */
function compareMapItems(item1, item2) {
    var key1 = item1[0];
    var key2 = item2[0];

    if (key1 === key2) {
        var value1 = item1[1];
        var value2 = item2[1];

        return value1 === value2 ? 0 : value1 > value2 ? 1 : -1;
    }

    return key1 > key2 ? 1 : -1;
}
