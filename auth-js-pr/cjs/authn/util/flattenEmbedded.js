"use strict";

exports.flattenEmbedded = flattenEmbedded;
var _util = require("../../util");
var _links2fns = require("./links2fns");
/* eslint-disable complexity */

function flattenEmbedded(sdk, tx, res, obj, ref) {
  obj = obj || res;
  obj = (0, _util.clone)(obj);
  if (Array.isArray(obj)) {
    var objArr = [];
    for (var o = 0, ol = obj.length; o < ol; o++) {
      objArr.push(flattenEmbedded(sdk, tx, res, obj[o], ref));
    }
    return objArr;
  }
  var embedded = obj._embedded || {};
  for (var key in embedded) {
    if (!Object.prototype.hasOwnProperty.call(embedded, key)) {
      continue;
    }

    // Flatten any nested _embedded objects
    if ((0, _util.isObject)(embedded[key]) || Array.isArray(embedded[key])) {
      embedded[key] = flattenEmbedded(sdk, tx, res, embedded[key], ref);
    }
  }

  // Convert any links on the embedded object
  var fns = (0, _links2fns.links2fns)(sdk, tx, res, obj, ref);
  Object.assign(embedded, fns);
  obj = (0, _util.omit)(obj, '_embedded', '_links');
  Object.assign(obj, embedded);
  return obj;
}
//# sourceMappingURL=flattenEmbedded.js.map