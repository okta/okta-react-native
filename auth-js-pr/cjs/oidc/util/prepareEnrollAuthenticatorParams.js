"use strict";

exports.prepareEnrollAuthenticatorParams = prepareEnrollAuthenticatorParams;
var _errors = require("../../errors");
var _defaultEnrollAuthenticatorParams = require("./defaultEnrollAuthenticatorParams");
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

function prepareParams(params) {
  params = {
    ...params,
    // forced params:
    responseType: 'none',
    prompt: 'enroll_authenticator',
    maxAge: 0
  };
  if (!params.enrollAmrValues) {
    throw new _errors.AuthSdkError('enroll_amr_values must be specified');
  }
  if (!params.acrValues) {
    // `acr_values` is required and should equal 'urn:okta:2fa:any:ifpossible'
    // But this can be changed in future
    throw new _errors.AuthSdkError('acr_values must be specified');
  }

  // `scope`, `nonce` must be omitted
  delete params.scopes;
  delete params.nonce;
  return params;
}

// Prepares params for a call to /authorize
function prepareEnrollAuthenticatorParams(sdk, options) {
  return prepareParams({
    ...(0, _defaultEnrollAuthenticatorParams.getDefaultEnrollAuthenticatorParams)(sdk),
    ...options
  });
}
//# sourceMappingURL=prepareEnrollAuthenticatorParams.js.map