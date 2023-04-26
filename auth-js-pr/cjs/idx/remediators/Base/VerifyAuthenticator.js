"use strict";

exports.VerifyAuthenticator = void 0;
var _Remediator = require("./Remediator");
var _authenticator = require("../../authenticator");
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

// Base class - DO NOT expose static remediationName
class VerifyAuthenticator extends _Remediator.Remediator {
  constructor(remediation, values = {}) {
    super(remediation, values);
    this.authenticator = (0, _authenticator.getAuthenticator)(remediation);
  }
  getNextStep(authClient, context) {
    var _context$authenticato;
    const nextStep = super.getNextStep(authClient, context);
    const authenticatorEnrollments = context === null || context === void 0 ? void 0 : (_context$authenticato = context.authenticatorEnrollments) === null || _context$authenticato === void 0 ? void 0 : _context$authenticato.value;
    return {
      ...nextStep,
      authenticatorEnrollments
    };
  }
  canRemediate() {
    return this.authenticator.canVerify(this.values);
  }
  mapCredentials() {
    return this.authenticator.mapCredentials(this.values);
  }
  getInputCredentials(input) {
    return this.authenticator.getInputs(input);
  }
  getValuesAfterProceed() {
    this.values = super.getValuesAfterProceed();
    let trimmedValues = Object.keys(this.values).filter(valueKey => valueKey !== 'credentials');
    return trimmedValues.reduce((values, valueKey) => ({
      ...values,
      [valueKey]: this.values[valueKey]
    }), {});
  }
}
exports.VerifyAuthenticator = VerifyAuthenticator;
//# sourceMappingURL=VerifyAuthenticator.js.map