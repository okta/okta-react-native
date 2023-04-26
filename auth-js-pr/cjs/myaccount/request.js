"use strict";

exports.generateRequestFnFromLinks = generateRequestFnFromLinks;
exports.sendRequest = sendRequest;
var _transactions = require("./transactions");
var _http = require("../http");
var _errors = require("../errors");
/* eslint-disable complexity */
async function sendRequest(oktaAuth, options) {
  const {
    accessToken: accessTokenObj
  } = oktaAuth.tokenManager.getTokensSync();
  const accessToken = options.accessToken || (accessTokenObj === null || accessTokenObj === void 0 ? void 0 : accessTokenObj.accessToken);
  const issuer = oktaAuth.getIssuerOrigin();
  const {
    url,
    method,
    payload
  } = options;
  const requestUrl = url.startsWith(issuer) ? url : `${issuer}${url}`;
  if (!accessToken) {
    throw new _errors.AuthSdkError('AccessToken is required to request MyAccount API endpoints.');
  }
  const res = await (0, _http.httpRequest)(oktaAuth, {
    headers: {
      'Accept': '*/*;okta-version=1.0.0'
    },
    accessToken,
    url: requestUrl,
    method,
    ...(payload && {
      args: payload
    })
  });
  const map = {
    EmailTransaction: _transactions.EmailTransaction,
    EmailStatusTransaction: _transactions.EmailStatusTransaction,
    EmailChallengeTransaction: _transactions.EmailChallengeTransaction,
    ProfileTransaction: _transactions.ProfileTransaction,
    ProfileSchemaTransaction: _transactions.ProfileSchemaTransaction,
    PhoneTransaction: _transactions.PhoneTransaction,
    PasswordTransaction: _transactions.PasswordTransaction
  };
  const TransactionClass = map[options.transactionClassName] || _transactions.BaseTransaction;
  if (Array.isArray(res)) {
    return res.map(item => new TransactionClass(oktaAuth, {
      res: item,
      accessToken
    }));
  }
  return new TransactionClass(oktaAuth, {
    res,
    accessToken
  });
}
/* eslint-enable complexity */

function generateRequestFnFromLinks({
  oktaAuth,
  accessToken,
  methodName,
  links,
  transactionClassName
}) {
  for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
    if (method.toLowerCase() === methodName) {
      const link = links.self;
      return async payload => sendRequest(oktaAuth, {
        accessToken,
        url: link.href,
        method,
        payload,
        transactionClassName
      });
    }
  }
  const link = links[methodName];
  if (!link) {
    throw new _errors.AuthSdkError(`No link is found with methodName: ${methodName}`);
  }
  return async payload => sendRequest(oktaAuth, {
    accessToken,
    url: link.href,
    method: link.hints.allow[0],
    payload,
    transactionClassName
  });
}
//# sourceMappingURL=request.js.map