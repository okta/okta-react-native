"use strict";

exports.jsonpath = jsonpath;
var _jsonpathPlus = require("jsonpath-plus");
function jsonpath(options) {
  // eslint-disable-next-line new-cap
  return (0, _jsonpathPlus.JSONPath)({
    // Disable javascript evaluation by default
    preventEval: true,
    ...options
  });
}
//# sourceMappingURL=jsonpath.js.map