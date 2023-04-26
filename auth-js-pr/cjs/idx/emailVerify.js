"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.EmailVerifyCallbackError = void 0;
exports.handleEmailVerifyCallback = handleEmailVerifyCallback;
exports.isEmailVerifyCallback = isEmailVerifyCallback;
exports.isEmailVerifyCallbackError = isEmailVerifyCallbackError;
exports.parseEmailVerifyCallback = parseEmailVerifyCallback;
var _CustomError = _interopRequireDefault(require("../errors/CustomError"));
var _urlParams = require("../oidc/util/urlParams");
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

class EmailVerifyCallbackError extends _CustomError.default {
  constructor(state, otp) {
    super(`Enter the OTP code in the originating client: ${otp}`);
    this.name = 'EmailVerifyCallbackError';
    this.state = state;
    this.otp = otp;
  }
}
exports.EmailVerifyCallbackError = EmailVerifyCallbackError;
function isEmailVerifyCallbackError(error) {
  return error.name === 'EmailVerifyCallbackError';
}

// Check if state && otp have been passed back in the url
function isEmailVerifyCallback(urlPath) {
  return /(otp=)/i.test(urlPath) && /(state=)/i.test(urlPath);
}

// Parse state and otp from a urlPath (should be either a search or fragment from the URL)
function parseEmailVerifyCallback(urlPath) {
  return (0, _urlParams.urlParamsToObject)(urlPath);
}
async function handleEmailVerifyCallback(authClient, search) {
  if (isEmailVerifyCallback(search)) {
    const {
      state,
      otp
    } = parseEmailVerifyCallback(search);
    if (authClient.idx.canProceed({
      state
    })) {
      // same browser / device
      return await authClient.idx.proceed({
        state,
        otp
      });
    } else {
      // different browser or device
      throw new EmailVerifyCallbackError(state, otp);
    }
  }
}
//# sourceMappingURL=emailVerify.js.map