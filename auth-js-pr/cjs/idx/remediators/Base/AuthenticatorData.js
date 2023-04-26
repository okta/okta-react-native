"use strict";

exports.AuthenticatorData = void 0;
var _Remediator = require("./Remediator");
var _api = require("../../types/api");
var _util = require("../../authenticator/util");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
class AuthenticatorData extends _Remediator.Remediator {
  constructor(remediation, values = {}) {
    super(remediation, values);

    // set before other data calculation
    this.authenticator = this.getAuthenticator();
    this.formatAuthenticatorData();
  }
  formatAuthenticatorData() {
    const authenticatorData = this.getAuthenticatorData();
    if (authenticatorData) {
      this.values.authenticatorsData = this.values.authenticatorsData.map(data => {
        if ((0, _util.compareAuthenticators)(this.authenticator, data)) {
          return this.mapAuthenticatorDataFromValues(data);
        }
        return data;
      });
    } else {
      const data = this.mapAuthenticatorDataFromValues();
      if (data) {
        this.values.authenticatorsData.push(data);
      }
    }
  }
  getAuthenticatorData() {
    return this.values.authenticatorsData.find(data => (0, _util.compareAuthenticators)(this.authenticator, data));
  }
  canRemediate() {
    return this.values.authenticatorsData.some(data => (0, _util.compareAuthenticators)(this.authenticator, data));
  }
  mapAuthenticatorDataFromValues(authenticatorData) {
    // add methodType to authenticatorData if it exists in values
    let {
      methodType,
      authenticator
    } = this.values;
    if (!methodType && (0, _api.isAuthenticator)(authenticator)) {
      methodType = authenticator === null || authenticator === void 0 ? void 0 : authenticator.methodType;
    }
    const {
      id,
      enrollmentId
    } = this.authenticator;
    const data = {
      id,
      enrollmentId,
      ...(authenticatorData && authenticatorData),
      ...(methodType && {
        methodType
      })
    };
    return data.methodType ? data : null;
  }
  getAuthenticatorFromRemediation() {
    const authenticator = this.remediation.value.find(({
      name
    }) => name === 'authenticator');
    return authenticator;
  }
  getValuesAfterProceed() {
    this.values = super.getValuesAfterProceed();
    // remove used authenticatorData
    const authenticatorsData = this.values.authenticatorsData.filter(data => (0, _util.compareAuthenticators)(this.authenticator, data) !== true);
    return {
      ...this.values,
      authenticatorsData
    };
  }
}
exports.AuthenticatorData = AuthenticatorData;
//# sourceMappingURL=AuthenticatorData.js.map