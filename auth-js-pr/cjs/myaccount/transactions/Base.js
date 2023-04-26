"use strict";

exports.default = void 0;
class BaseTransaction {
  // Deprecated

  constructor(oktaAuth, options) {
    const {
      res
    } = options;
    const {
      headers,
      ...rest
    } = res;

    // assign required fields from res
    if (headers) {
      this.headers = headers;
    }

    // add all rest fields from res
    Object.keys(rest).forEach(key => {
      if (key === '_links') {
        return;
      }
      this[key] = rest[key];
    });
  }
}
exports.default = BaseTransaction;
module.exports = exports.default;
//# sourceMappingURL=Base.js.map