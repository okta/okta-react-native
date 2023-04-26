"use strict";

exports.verifyEmailChallenge = exports.sendEmailChallenge = exports.getEmails = exports.getEmailChallenge = exports.getEmail = exports.deleteEmail = exports.addEmail = void 0;
var _request = require("./request");
/**
 * @scope: okta.myAccount.email.read
 */
const getEmails = async (oktaAuth, options) => {
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: '/idp/myaccount/emails',
    method: 'GET',
    accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
    transactionClassName: 'EmailTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.email.read
 */
exports.getEmails = getEmails;
const getEmail = async (oktaAuth, options) => {
  const {
    id,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/emails/${id}`,
    method: 'GET',
    accessToken,
    transactionClassName: 'EmailTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.email.manage
 */
exports.getEmail = getEmail;
const addEmail = async (oktaAuth, options) => {
  const {
    accessToken,
    payload
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: '/idp/myaccount/emails',
    method: 'POST',
    payload,
    accessToken,
    transactionClassName: 'EmailTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.email.manage
 */
exports.addEmail = addEmail;
const deleteEmail = async (oktaAuth, options) => {
  const {
    id,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/emails/${id}`,
    method: 'DELETE',
    accessToken
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.email.read
 */
exports.deleteEmail = deleteEmail;
const sendEmailChallenge = async (oktaAuth, options) => {
  const {
    id,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/emails/${id}/challenge`,
    method: 'POST',
    accessToken,
    transactionClassName: 'EmailChallengeTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.email.read
 */
exports.sendEmailChallenge = sendEmailChallenge;
const getEmailChallenge = async (oktaAuth, options) => {
  const {
    emailId,
    challengeId,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/emails/${emailId}/challenge/${challengeId}`,
    method: 'POST',
    accessToken,
    transactionClassName: 'EmailChallengeTransaction'
  });
  return transaction;
};

/**
 * @scope: okta.myAccount.email.manage
 */
exports.getEmailChallenge = getEmailChallenge;
const verifyEmailChallenge = async (oktaAuth, options) => {
  const {
    emailId,
    challengeId,
    payload,
    accessToken
  } = options;
  const transaction = await (0, _request.sendRequest)(oktaAuth, {
    url: `/idp/myaccount/emails/${emailId}/challenge/${challengeId}/verify`,
    method: 'POST',
    payload,
    accessToken
  });
  return transaction;
};
exports.verifyEmailChallenge = verifyEmailChallenge;
//# sourceMappingURL=emailApi.js.map