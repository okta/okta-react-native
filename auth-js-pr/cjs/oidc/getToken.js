"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.getToken = getToken;
var _util = require("./util");
var _AuthSdkError = _interopRequireDefault(require("../errors/AuthSdkError"));
var _prepareTokenParams = require("./util/prepareTokenParams");
var _authorize = require("./endpoints/authorize");
var _handleOAuthResponse = require("./handleOAuthResponse");
/* global document */
/* eslint-disable complexity, max-statements */
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

/*
 * Retrieve an idToken from an Okta or a third party idp
 *
 * Two main flows:
 *
 *  1) Exchange a sessionToken for a token
 *
 *    Required:
 *      clientId: passed via the OktaAuth constructor or into getToken
 *      sessionToken: 'yourtoken'
 *
 *    Optional:
 *      redirectUri: defaults to window.location.href
 *      scopes: defaults to ['openid', 'email']
 *
 *    Forced:
 *      prompt: 'none'
 *      responseMode: 'okta_post_message'
 *      display: undefined
 *
 *  2) Get a token from an idp
 *
 *    Required:
 *      clientId: passed via the OktaAuth constructor or into getToken
 *
 *    Optional:
 *      redirectUri: defaults to window.location.href
 *      scopes: defaults to ['openid', 'email']
 *      idp: defaults to Okta as an idp
 *      prompt: no default. Pass 'none' to throw an error if user is not signed in
 *
 *    Forced:
 *      display: 'popup'
 *
 *  Only common optional params shown. Any OAuth parameters not explicitly forced are available to override
 *
 * @param {Object} oauthOptions
 * @param {String} [oauthOptions.clientId] ID of this client
 * @param {String} [oauthOptions.redirectUri] URI that the iframe or popup will go to once authenticated
 * @param {String[]} [oauthOptions.scopes] OAuth 2.0 scopes to request (openid must be specified)
 * @param {String} [oauthOptions.idp] ID of an external IdP to use for user authentication
 * @param {String} [oauthOptions.sessionToken] Bootstrap Session Token returned by the Okta Authentication API
 * @param {String} [oauthOptions.prompt] Determines whether the Okta login will be displayed on failure.
 *                                       Use 'none' to prevent this behavior
 *
 * @param {Object} options
 * @param {Integer} [options.timeout] Time in ms before the flow is automatically terminated. Defaults to 120000
 * @param {String} [options.popupTitle] Title dispayed in the popup.
 *                                      Defaults to 'External Identity Provider User Authentication'
 */
function getToken(sdk, options) {
  if (arguments.length > 2) {
    return Promise.reject(new _AuthSdkError.default('As of version 3.0, "getToken" takes only a single set of options'));
  }
  options = options || {};

  // window object cannot be serialized, save for later use
  // TODO: move popup related params into a separate options object
  const popupWindow = options.popupWindow;
  options.popupWindow = undefined;
  return (0, _prepareTokenParams.prepareTokenParams)(sdk, options).then(function (tokenParams) {
    // Start overriding any options that don't make sense
    var sessionTokenOverrides = {
      prompt: 'none',
      responseMode: 'okta_post_message',
      display: null
    };
    var idpOverrides = {
      display: 'popup'
    };
    if (options.sessionToken) {
      Object.assign(tokenParams, sessionTokenOverrides);
    } else if (options.idp) {
      Object.assign(tokenParams, idpOverrides);
    }

    // Use the query params to build the authorize url
    var requestUrl, endpoint, urls;

    // Get authorizeUrl and issuer
    urls = (0, _util.getOAuthUrls)(sdk, tokenParams);
    endpoint = options.codeVerifier ? urls.tokenUrl : urls.authorizeUrl;
    requestUrl = endpoint + (0, _authorize.buildAuthorizeParams)(tokenParams);

    // Determine the flow type
    var flowType;
    if (tokenParams.sessionToken || tokenParams.display === null) {
      flowType = 'IFRAME';
    } else if (tokenParams.display === 'popup') {
      flowType = 'POPUP';
    } else {
      flowType = 'IMPLICIT';
    }

    // Execute the flow type
    switch (flowType) {
      case 'IFRAME':
        var iframePromise = (0, _util.addPostMessageListener)(sdk, options.timeout, tokenParams.state);
        var iframeEl = (0, _util.loadFrame)(requestUrl);
        return iframePromise.then(function (res) {
          return (0, _handleOAuthResponse.handleOAuthResponse)(sdk, tokenParams, res, urls);
        }).finally(function () {
          if (document.body.contains(iframeEl)) {
            var _iframeEl$parentEleme;
            (_iframeEl$parentEleme = iframeEl.parentElement) === null || _iframeEl$parentEleme === void 0 ? void 0 : _iframeEl$parentEleme.removeChild(iframeEl);
          }
        });
      case 'POPUP':
        var oauthPromise; // resolves with OAuth response

        // Add listener on postMessage before window creation, so
        // postMessage isn't triggered before we're listening
        if (tokenParams.responseMode === 'okta_post_message') {
          if (!sdk.features.isPopupPostMessageSupported()) {
            throw new _AuthSdkError.default('This browser doesn\'t have full postMessage support');
          }
          oauthPromise = (0, _util.addPostMessageListener)(sdk, options.timeout, tokenParams.state);
        }

        // Redirect for authorization
        // popupWindown can be null when popup is blocked
        if (popupWindow) {
          popupWindow.location.assign(requestUrl);
        }

        // The popup may be closed without receiving an OAuth response. Setup a poller to monitor the window.
        var popupPromise = new Promise(function (resolve, reject) {
          var closePoller = setInterval(function () {
            if (!popupWindow || popupWindow.closed) {
              clearInterval(closePoller);
              reject(new _AuthSdkError.default('Unable to parse OAuth flow response'));
            }
          }, 100);

          // Proxy the OAuth promise results
          oauthPromise.then(function (res) {
            clearInterval(closePoller);
            resolve(res);
          }).catch(function (err) {
            clearInterval(closePoller);
            reject(err);
          });
        });
        return popupPromise.then(function (res) {
          return (0, _handleOAuthResponse.handleOAuthResponse)(sdk, tokenParams, res, urls);
        }).finally(function () {
          if (popupWindow && !popupWindow.closed) {
            popupWindow.close();
          }
        });
      default:
        throw new _AuthSdkError.default('The full page redirect flow is not supported');
    }
  });
}
//# sourceMappingURL=getToken.js.map