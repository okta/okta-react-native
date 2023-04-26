"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.SelectAuthenticatorAuthenticate = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _SelectAuthenticator = require("./Base/SelectAuthenticator");
var _util = require("./util");
var _types = require("../types");
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

class SelectAuthenticatorAuthenticate extends _SelectAuthenticator.SelectAuthenticator {
  constructor(remediation, values = {}, options = {}) {
    var _getAuthenticatorFrom;
    super(remediation, values, options);

    // Preset password authenticator to trigger recover action
    const isRecoveryFlow = this.options.flow === 'recoverPassword';
    const hasPasswordInOptions = (_getAuthenticatorFrom = (0, _util.getAuthenticatorFromRemediation)(remediation).options) === null || _getAuthenticatorFrom === void 0 ? void 0 : _getAuthenticatorFrom.some(({
      relatesTo
    }) => (relatesTo === null || relatesTo === void 0 ? void 0 : relatesTo.key) === _types.AuthenticatorKey.OKTA_PASSWORD);
    if (hasPasswordInOptions && (isRecoveryFlow || this.values.password)) {
      this.values.authenticators = [...(this.values.authenticators || []), {
        key: _types.AuthenticatorKey.OKTA_PASSWORD
      }];
    }
  }
}
exports.SelectAuthenticatorAuthenticate = SelectAuthenticatorAuthenticate;
(0, _defineProperty2.default)(SelectAuthenticatorAuthenticate, "remediationName", 'select-authenticator-authenticate');
//# sourceMappingURL=SelectAuthenticatorAuthenticate.js.map