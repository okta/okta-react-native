"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
var _request = require("../request");
class PhoneTransaction extends _Base.default {
  // eslint-disable-next-line no-use-before-define

  constructor(oktaAuth, options) {
    super(oktaAuth, options);
    const {
      res,
      accessToken
    } = options;
    // assign required fields from res
    const {
      id,
      profile,
      status,
      _links
    } = res;
    this.id = id;
    this.profile = profile;
    this.status = status;

    // assign transformed fns to transaction
    this.get = async () => {
      const fn = (0, _request.generateRequestFnFromLinks)({
        oktaAuth,
        accessToken,
        methodName: 'get',
        links: _links,
        transactionClassName: 'PhoneTransaction'
      });
      return await fn();
    };
    this.delete = async () => {
      const fn = (0, _request.generateRequestFnFromLinks)({
        oktaAuth,
        accessToken,
        methodName: 'delete',
        links: _links
      });
      return await fn();
    };
    this.challenge = async payload => {
      const fn = (0, _request.generateRequestFnFromLinks)({
        oktaAuth,
        accessToken,
        methodName: 'challenge',
        links: _links
      });
      return await fn(payload);
    };
    if (_links.verify) {
      this.verify = async payload => {
        const fn = (0, _request.generateRequestFnFromLinks)({
          oktaAuth,
          accessToken,
          methodName: 'verify',
          links: _links
        });
        return await fn(payload);
      };
    }
  }
}
exports.default = PhoneTransaction;
module.exports = exports.default;
//# sourceMappingURL=PhoneTransaction.js.map