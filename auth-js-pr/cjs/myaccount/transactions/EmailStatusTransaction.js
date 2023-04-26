"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
class EmailStatusTransaction extends _Base.default {
  constructor(oktaAuth, options) {
    super(oktaAuth, options);
    const {
      res
    } = options;
    // assign required fields from res
    const {
      id,
      profile,
      expiresAt,
      status
    } = res;
    this.id = id;
    this.expiresAt = expiresAt;
    this.profile = profile;
    this.status = status;
  }
}
exports.default = EmailStatusTransaction;
module.exports = exports.default;
//# sourceMappingURL=EmailStatusTransaction.js.map