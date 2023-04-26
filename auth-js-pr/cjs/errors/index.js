"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _exportNames = {
  isAuthApiError: true,
  isOAuthError: true,
  AuthApiError: true,
  AuthPollStopError: true,
  AuthSdkError: true,
  OAuthError: true
};
Object.defineProperty(exports, "AuthApiError", {
  enumerable: true,
  get: function () {
    return _AuthApiError.default;
  }
});
Object.defineProperty(exports, "AuthPollStopError", {
  enumerable: true,
  get: function () {
    return _AuthPollStopError.default;
  }
});
Object.defineProperty(exports, "AuthSdkError", {
  enumerable: true,
  get: function () {
    return _AuthSdkError.default;
  }
});
Object.defineProperty(exports, "OAuthError", {
  enumerable: true,
  get: function () {
    return _OAuthError.default;
  }
});
exports.isAuthApiError = isAuthApiError;
exports.isOAuthError = isOAuthError;
var _AuthApiError = _interopRequireDefault(require("./AuthApiError"));
var _AuthPollStopError = _interopRequireDefault(require("./AuthPollStopError"));
var _AuthSdkError = _interopRequireDefault(require("./AuthSdkError"));
var _OAuthError = _interopRequireDefault(require("./OAuthError"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
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

function isAuthApiError(obj) {
  return obj instanceof _AuthApiError.default;
}
function isOAuthError(obj) {
  return obj instanceof _OAuthError.default;
}
//# sourceMappingURL=index.js.map