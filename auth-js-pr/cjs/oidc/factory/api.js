"use strict";

exports.createEndpoints = createEndpoints;
exports.createTokenAPI = createTokenAPI;
var _util = require("../../util");
var _decodeToken = require("../decodeToken");
var _exchangeCodeForTokens = require("../exchangeCodeForTokens");
var _getUserInfo = require("../getUserInfo");
var _getWithoutPrompt = require("../getWithoutPrompt");
var _getWithPopup = require("../getWithPopup");
var _getWithRedirect = require("../getWithRedirect");
var _parseFromUrl = require("../parseFromUrl");
var _renewToken = require("../renewToken");
var _renewTokens = require("../renewTokens");
var _renewTokensWithRefresh = require("../renewTokensWithRefresh");
var _revokeToken = require("../revokeToken");
var _util2 = require("../util");
var _verifyToken = require("../verifyToken");
var _enrollAuthenticator = require("../enrollAuthenticator");
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

// Factory
function createTokenAPI(sdk, queue) {
  const useQueue = method => {
    return _util.PromiseQueue.prototype.push.bind(queue, method, null);
  };
  const getWithRedirectFn = useQueue(_getWithRedirect.getWithRedirect.bind(null, sdk));

  // eslint-disable-next-line max-len
  const parseFromUrlFn = useQueue(_parseFromUrl.parseFromUrl.bind(null, sdk));
  const parseFromUrlApi = Object.assign(parseFromUrlFn, {
    // This is exposed so we can mock getting window.history in our tests
    _getHistory: function () {
      return window.history;
    },
    // This is exposed so we can mock getting window.location in our tests
    _getLocation: function () {
      return window.location;
    },
    // This is exposed so we can mock getting window.document in our tests
    _getDocument: function () {
      return window.document;
    }
  });
  const token = {
    prepareTokenParams: _util2.prepareTokenParams.bind(null, sdk),
    exchangeCodeForTokens: _exchangeCodeForTokens.exchangeCodeForTokens.bind(null, sdk),
    getWithoutPrompt: _getWithoutPrompt.getWithoutPrompt.bind(null, sdk),
    getWithPopup: _getWithPopup.getWithPopup.bind(null, sdk),
    getWithRedirect: getWithRedirectFn,
    parseFromUrl: parseFromUrlApi,
    decode: _decodeToken.decodeToken,
    revoke: _revokeToken.revokeToken.bind(null, sdk),
    renew: _renewToken.renewToken.bind(null, sdk),
    renewTokensWithRefresh: _renewTokensWithRefresh.renewTokensWithRefresh.bind(null, sdk),
    renewTokens: _renewTokens.renewTokens.bind(null, sdk),
    getUserInfo: (accessTokenObject, idTokenObject) => {
      return (0, _getUserInfo.getUserInfo)(sdk, accessTokenObject, idTokenObject);
    },
    verify: _verifyToken.verifyToken.bind(null, sdk),
    isLoginRedirect: _util2.isLoginRedirect.bind(null, sdk)
  };

  // Wrap certain async token API methods using PromiseQueue to avoid issues with concurrency
  // 'getWithRedirect' and 'parseFromUrl' are already wrapped
  const toWrap = ['getWithoutPrompt', 'getWithPopup', 'revoke', 'renew', 'renewTokensWithRefresh', 'renewTokens'];
  toWrap.forEach(key => {
    token[key] = useQueue(token[key]);
  });
  return token;
}
function createEndpoints(sdk) {
  return {
    authorize: {
      enrollAuthenticator: _enrollAuthenticator.enrollAuthenticator.bind(null, sdk)
    }
  };
}
//# sourceMappingURL=api.js.map