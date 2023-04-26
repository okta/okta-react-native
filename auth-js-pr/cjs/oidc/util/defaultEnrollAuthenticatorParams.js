"use strict";

exports.getDefaultEnrollAuthenticatorParams = getDefaultEnrollAuthenticatorParams;
var _oauth = require("./oauth");
var _features = require("../../features");
var _util = require("../../util");
/* global window */
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

function getDefaultEnrollAuthenticatorParams(sdk) {
  const {
    clientId,
    redirectUri,
    responseMode,
    state
  } = sdk.options;
  const defaultRedirectUri = (0, _features.isBrowser)() ? window.location.href : undefined;
  return (0, _util.removeNils)({
    clientId,
    redirectUri: redirectUri || defaultRedirectUri,
    responseMode,
    state: state || (0, _oauth.generateState)(),
    responseType: 'none',
    prompt: 'enroll_authenticator'
  });
}
//# sourceMappingURL=defaultEnrollAuthenticatorParams.js.map