"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.createOAuthOptionsConstructor = createOAuthOptionsConstructor;
var _constants = require("../../constants");
var _url = require("../../util/url");
var _features = require("../../features");
var _options = require("../../http/options");
var _node = require("./node");
var _AuthSdkError = _interopRequireDefault(require("../../errors/AuthSdkError"));
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
 */

function assertValidConfig(args) {
  args = args || {};
  var scopes = args.scopes;
  if (scopes && !Array.isArray(scopes)) {
    throw new _AuthSdkError.default('scopes must be a array of strings. ' + 'Required usage: new OktaAuth({scopes: ["openid", "email"]})');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  var issuer = args.issuer;
  if (!issuer) {
    throw new _AuthSdkError.default('No issuer passed to constructor. ' + 'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com/oauth2/{authServerId}"})');
  }
  var isUrlRegex = new RegExp('^http?s?://.+');
  if (!isUrlRegex.test(issuer)) {
    throw new _AuthSdkError.default('Issuer must be a valid URL. ' + 'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com/oauth2/{authServerId}"})');
  }
  if (issuer.indexOf('-admin.') !== -1) {
    throw new _AuthSdkError.default('Issuer URL passed to constructor contains "-admin" in subdomain. ' + 'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com})');
  }
}
function createOAuthOptionsConstructor() {
  const HttpOptionsConstructor = (0, _options.createHttpOptionsConstructor)();
  return class OAuthOptionsConstructor extends HttpOptionsConstructor {
    // CustomUrls

    // TokenParams

    // Additional options

    // For server-side web applications ONLY!

    // Workaround for bad client time/clock

    // eslint-disable-next-line max-statements
    constructor(options) {
      super(options);
      assertValidConfig(options);
      this.issuer = (0, _url.removeTrailingSlash)(options.issuer);
      this.tokenUrl = (0, _url.removeTrailingSlash)(options.tokenUrl);
      this.authorizeUrl = (0, _url.removeTrailingSlash)(options.authorizeUrl);
      this.userinfoUrl = (0, _url.removeTrailingSlash)(options.userinfoUrl);
      this.revokeUrl = (0, _url.removeTrailingSlash)(options.revokeUrl);
      this.logoutUrl = (0, _url.removeTrailingSlash)(options.logoutUrl);
      this.pkce = options.pkce === false ? false : true; // PKCE defaults to true
      this.clientId = options.clientId;
      this.redirectUri = options.redirectUri;
      if ((0, _features.isBrowser)()) {
        this.redirectUri = (0, _url.toAbsoluteUrl)(options.redirectUri, window.location.origin); // allow relative URIs
      }

      this.responseType = options.responseType;
      this.responseMode = options.responseMode;
      this.state = options.state;
      this.scopes = options.scopes;
      // Give the developer the ability to disable token signature validation.
      this.ignoreSignature = !!options.ignoreSignature;
      this.codeChallenge = options.codeChallenge;
      this.codeChallengeMethod = options.codeChallengeMethod;
      this.acrValues = options.acrValues;
      this.maxAge = options.maxAge;
      this.tokenManager = options.tokenManager;
      this.postLogoutRedirectUri = options.postLogoutRedirectUri;
      this.restoreOriginalUri = options.restoreOriginalUri;
      this.transactionManager = {
        enableSharedStorage: _node.enableSharedStorage,
        ...options.transactionManager
      };
      this.clientSecret = options.clientSecret;
      this.setLocation = options.setLocation;

      // As some end user's devices can have their date 
      // and time incorrectly set, allow for the disabling
      // of the jwt liftetime validation
      this.ignoreLifetime = !!options.ignoreLifetime;

      // Digital clocks will drift over time, so the server
      // can misalign with the time reported by the browser.
      // The maxClockSkew allows relaxing the time-based
      // validation of tokens (in seconds, not milliseconds).
      // It currently defaults to 300, because 5 min is the
      // default maximum tolerance allowed by Kerberos.
      // (https://technet.microsoft.com/en-us/library/cc976357.aspx)
      if (!options.maxClockSkew && options.maxClockSkew !== 0) {
        this.maxClockSkew = _constants.DEFAULT_MAX_CLOCK_SKEW;
      } else {
        this.maxClockSkew = options.maxClockSkew;
      }
    }
  };
}
//# sourceMappingURL=OAuthOptionsConstructor.js.map