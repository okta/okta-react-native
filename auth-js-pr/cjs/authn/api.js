"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.getSavedStateToken = getSavedStateToken;
exports.introspectAuthn = introspectAuthn;
exports.postToTransaction = postToTransaction;
exports.resumeTransaction = resumeTransaction;
exports.transactionExists = transactionExists;
exports.transactionStatus = transactionStatus;
exports.transactionStep = transactionStep;
var _http = require("../http");
var _AuthSdkError = _interopRequireDefault(require("../errors/AuthSdkError"));
var _constants = require("../constants");
var _stateToken = require("./util/stateToken");
/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

/* eslint-disable complexity, max-statements */

function transactionStatus(sdk, args) {
  args = (0, _stateToken.addStateToken)(sdk, args);
  return (0, _http.post)(sdk, sdk.getIssuerOrigin() + '/api/v1/authn', args, {
    withCredentials: true
  });
}
function resumeTransaction(sdk, tx, args) {
  if (!args || !args.stateToken) {
    var stateToken = getSavedStateToken(sdk);
    if (stateToken) {
      args = {
        stateToken: stateToken
      };
    } else {
      return Promise.reject(new _AuthSdkError.default('No transaction to resume'));
    }
  }
  return transactionStatus(sdk, args).then(function (res) {
    return tx.createTransaction(res);
  });
}
function introspectAuthn(sdk, tx, args) {
  if (!args || !args.stateToken) {
    var stateToken = getSavedStateToken(sdk);
    if (stateToken) {
      args = {
        stateToken: stateToken
      };
    } else {
      return Promise.reject(new _AuthSdkError.default('No transaction to evaluate'));
    }
  }
  return transactionStep(sdk, args).then(function (res) {
    return tx.createTransaction(res);
  });
}
function transactionStep(sdk, args) {
  args = (0, _stateToken.addStateToken)(sdk, args);
  // v1 pipeline introspect API
  return (0, _http.post)(sdk, sdk.getIssuerOrigin() + '/api/v1/authn/introspect', args, {
    withCredentials: true
  });
}
function transactionExists(sdk) {
  // We have a cookie state token
  return !!getSavedStateToken(sdk);
}
function postToTransaction(sdk, tx, url, args, options) {
  options = Object.assign({
    withCredentials: true
  }, options);
  return (0, _http.post)(sdk, url, args, options).then(function (res) {
    return tx.createTransaction(res);
  });
}
function getSavedStateToken(sdk) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const storage = sdk.options.storageUtil.storage;
  return storage.get(_constants.STATE_TOKEN_KEY_NAME);
}
//# sourceMappingURL=api.js.map