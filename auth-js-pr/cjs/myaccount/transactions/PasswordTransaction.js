"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _types = require("../types");
var _Base = _interopRequireDefault(require("./Base"));
var _request = require("../request");
class PasswordTransaction extends _Base.default {
  // eslint-disable-next-line no-use-before-define

  // eslint-disable-next-line no-use-before-define

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
      status,
      created,
      lastUpdated,
      _links
    } = res;
    this.id = id;
    this.status = status;
    this.created = created;
    this.lastUpdated = lastUpdated;

    // assign transformed fns to transaction
    if (this.status == _types.PasswordStatus.NOT_ENROLLED) {
      this.enroll = async payload => {
        const fn = (0, _request.generateRequestFnFromLinks)({
          oktaAuth,
          accessToken,
          methodName: 'enroll',
          links: _links,
          transactionClassName: 'PasswordTransaction'
        });
        return await fn(payload);
      };
    } else {
      this.get = async () => {
        const fn = (0, _request.generateRequestFnFromLinks)({
          oktaAuth,
          accessToken,
          methodName: 'get',
          links: _links,
          transactionClassName: 'PasswordTransaction'
        });
        return await fn();
      };
      this.update = async payload => {
        const fn = (0, _request.generateRequestFnFromLinks)({
          oktaAuth,
          accessToken,
          methodName: 'put',
          links: _links,
          transactionClassName: 'PasswordTransaction'
        });
        return await fn(payload);
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
    }
  }
}
exports.default = PasswordTransaction;
module.exports = exports.default;
//# sourceMappingURL=PasswordTransaction.js.map