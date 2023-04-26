"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
class ProfileTransaction extends _Base.default {
  constructor(oktaAuth, options) {
    super(oktaAuth, options);
    const {
      createdAt,
      modifiedAt,
      profile
    } = options.res;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.profile = profile;
  }
}
exports.default = ProfileTransaction;
module.exports = exports.default;
//# sourceMappingURL=ProfileTransaction.js.map