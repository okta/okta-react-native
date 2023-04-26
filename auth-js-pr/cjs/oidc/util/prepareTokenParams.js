"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.assertPKCESupport = assertPKCESupport;
exports.preparePKCE = preparePKCE;
exports.prepareTokenParams = prepareTokenParams;
exports.validateCodeChallengeMethod = validateCodeChallengeMethod;
var _wellKnown = require("../endpoints/well-known");
var _errors = require("../../errors");
var _defaultTokenParams = require("./defaultTokenParams");
var _constants = require("../../constants");
var _pkce = _interopRequireDefault(require("./pkce"));
/* eslint-disable complexity */
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

function assertPKCESupport(sdk) {
  if (!sdk.features.isPKCESupported()) {
    var errorMessage = 'PKCE requires a modern browser with encryption support running in a secure context.';
    if (!sdk.features.isHTTPS()) {
      // eslint-disable-next-line max-len
      errorMessage += '\nThe current page is not being served with HTTPS protocol. PKCE requires secure HTTPS protocol.';
    }
    if (!sdk.features.hasTextEncoder()) {
      // eslint-disable-next-line max-len
      errorMessage += '\n"TextEncoder" is not defined. To use PKCE, you may need to include a polyfill/shim for this browser.';
    }
    throw new _errors.AuthSdkError(errorMessage);
  }
}
async function validateCodeChallengeMethod(sdk, codeChallengeMethod) {
  // set default code challenge method, if none provided
  codeChallengeMethod = codeChallengeMethod || sdk.options.codeChallengeMethod || _constants.DEFAULT_CODE_CHALLENGE_METHOD;

  // validate against .well-known/openid-configuration
  const wellKnownResponse = await (0, _wellKnown.getWellKnown)(sdk);
  var methods = wellKnownResponse['code_challenge_methods_supported'] || [];
  if (methods.indexOf(codeChallengeMethod) === -1) {
    throw new _errors.AuthSdkError('Invalid code_challenge_method');
  }
  return codeChallengeMethod;
}
async function preparePKCE(sdk, tokenParams) {
  let {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod
  } = tokenParams;

  // PKCE calculations can be avoided by passing a codeChallenge
  codeChallenge = codeChallenge || sdk.options.codeChallenge;
  if (!codeChallenge) {
    assertPKCESupport(sdk);
    codeVerifier = codeVerifier || _pkce.default.generateVerifier();
    codeChallenge = await _pkce.default.computeChallenge(codeVerifier);
  }
  codeChallengeMethod = await validateCodeChallengeMethod(sdk, codeChallengeMethod);

  // Clone/copy the params. Set PKCE values
  tokenParams = {
    ...tokenParams,
    responseType: 'code',
    // responseType is forced
    codeVerifier,
    codeChallenge,
    codeChallengeMethod
  };
  return tokenParams;
}

// Prepares params for a call to /authorize or /token
async function prepareTokenParams(sdk, tokenParams = {}) {
  // build params using defaults + options
  const defaults = (0, _defaultTokenParams.getDefaultTokenParams)(sdk);
  tokenParams = {
    ...defaults,
    ...tokenParams
  };
  if (tokenParams.pkce === false) {
    // Implicit flow or authorization_code without PKCE
    return tokenParams;
  }
  return preparePKCE(sdk, tokenParams);
}
//# sourceMappingURL=prepareTokenParams.js.map