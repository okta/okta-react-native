"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
var _request = require("../request");
class EmailTransaction extends _Base.default {
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
      profile,
      roles,
      status,
      _links
    } = res;
    this.id = id;
    this.profile = profile;
    this.roles = roles;
    this.status = status;

    // assign transformed fns to transaction
    this.get = async () => {
      const fn = (0, _request.generateRequestFnFromLinks)({
        oktaAuth,
        accessToken,
        methodName: 'get',
        links: _links,
        transactionClassName: 'EmailTransaction'
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
    this.challenge = async () => {
      const fn = (0, _request.generateRequestFnFromLinks)({
        oktaAuth,
        accessToken,
        methodName: 'challenge',
        links: _links,
        transactionClassName: 'EmailChallengeTransaction'
      });
      return await fn();
    };
    if (_links.poll) {
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
    }
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
exports.default = EmailTransaction;
module.exports = exports.default;
//# sourceMappingURL=EmailTransaction.js.map