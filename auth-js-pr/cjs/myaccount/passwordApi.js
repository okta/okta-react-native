"use strict";

exports.updatePassword = exports.getPassword = exports.enrollPassword = exports.deletePassword = void 0;
var _request = require("./request");
/**
 * @scope: okta.myAccount.password.read
 */
const getPassword = async (oktaAuth, options) => {
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/password`,
    method: 'GET',
    accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
    transactionClassName: 'PasswordTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.password.manage
 */
exports.getPassword = getPassword;
const enrollPassword = async (oktaAuth, options) => {
  const {
    accessToken,
    payload
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: '/idp/myaccount/password',
    method: 'POST',
    payload,
    accessToken,
    transactionClassName: 'PasswordTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.password.manage
 */
exports.enrollPassword = enrollPassword;
const updatePassword = async (oktaAuth, options) => {
  const {
    accessToken,
    payload
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: '/idp/myaccount/password',
    method: 'PUT',
    payload,
    accessToken,
    transactionClassName: 'PasswordTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.password.manage
 */
exports.updatePassword = updatePassword;
const deletePassword = async (oktaAuth, options) => {
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/password`,
    method: 'DELETE',
    accessToken: options === null || options === void 0 ? void 0 : options.accessToken
  });
  return transaction;
};
exports.deletePassword = deletePassword;
//# sourceMappingURL=passwordApi.js.map