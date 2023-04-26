"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
var _request = require("../request");
class EmailChallengeTransaction extends _Base.default {
  // eslint-disable-next-line no-use-before-define

  constructor(oktaAuth, options) {
    super(oktaAuth, options);
    const {
      accessToken,
      res
    } = options;
    // assign required fields from res
    const {
      id,
      expiresAt,
      profile,
      status,
      _links
    } = res;
    this.id = id;
    this.expiresAt = expiresAt;
    this.profile = profile;
    this.status = status;

    // assign transformed fns to transaction
    this.poll = async () => {
      const fn = (0, _request.generateRequestFnFromLinks)({
        oktaAuth,
        accessToken,
        methodName: 'poll',
        links: _links,
        transactionClassName: 'EmailStatusTransaction'
      });
      return await fn();
    };
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
exports.default = EmailChallengeTransaction;
module.exports = exports.default;
//# sourceMappingURL=EmailChallengeTransaction.js.map