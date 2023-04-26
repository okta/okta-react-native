"use strict";

exports.verifyPhoneChallenge = exports.sendPhoneChallenge = exports.getPhones = exports.getPhone = exports.deletePhone = exports.addPhone = void 0;
var _request = require("./request");
/**
 * @scope: okta.myAccount.phone.read
 */
const getPhones = async (oktaAuth, options) => {
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: '/idp/myaccount/phones',
    method: 'GET',
    accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
    transactionClassName: 'PhoneTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.phone.read
 */
exports.getPhones = getPhones;
const getPhone = async (oktaAuth, options) => {
  const {
    accessToken,
    id
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/phones/${id}`,
    method: 'GET',
    accessToken,
    transactionClassName: 'PhoneTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.phone.manage
 */
exports.getPhone = getPhone;
const addPhone = async (oktaAuth, options) => {
  const {
    accessToken,
    payload
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: '/idp/myaccount/phones',
    method: 'POST',
    payload,
    accessToken,
    transactionClassName: 'PhoneTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.phone.manage
 */
exports.addPhone = addPhone;
const deletePhone = async (oktaAuth, options) => {
  const {
    id,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/phones/${id}`,
    method: 'DELETE',
    accessToken
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.phone.manage
 */
exports.deletePhone = deletePhone;
const sendPhoneChallenge = async (oktaAuth, options) => {
  const {
    accessToken,
    id,
    payload
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/phones/${id}/challenge`,
    method: 'POST',
    payload,
    accessToken
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.phone.manage
 */
exports.sendPhoneChallenge = sendPhoneChallenge;
const verifyPhoneChallenge = async (oktaAuth, options) => {
  const {
    id,
    payload,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/phones/${id}/verify`,
    method: 'POST',
    payload,
    accessToken
  });
  return transaction;
};
exports.verifyPhoneChallenge = verifyPhoneChallenge;
//# sourceMappingURL=phoneApi.js.map