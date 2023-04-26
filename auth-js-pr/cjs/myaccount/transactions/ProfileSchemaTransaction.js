"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
class ProfileSchemaTransaction extends _Base.default {
  constructor(oktaAuth, options) {
    super(oktaAuth, options);
    this.properties = options.res.properties;
  }
}
exports.default = ProfileSchemaTransaction;
module.exports = exports.default;
//# sourceMappingURL=ProfileSchemaTransaction.js.map