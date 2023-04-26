"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.AuthenticatorEnrollmentData = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _AuthenticatorData = require("./Base/AuthenticatorData");
var _util = require("./util");
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

class AuthenticatorEnrollmentData extends _AuthenticatorData.AuthenticatorData {
  mapAuthenticator() {
    const authenticatorData = this.getAuthenticatorData();
    const authenticatorFromRemediation = (0, _util.getAuthenticatorFromRemediation)(this.remediation);
    return {
      id: authenticatorFromRemediation.form.value.find(({
        name
      }) => name === 'id').value,
      methodType: authenticatorData.methodType,
      phoneNumber: authenticatorData.phoneNumber
    };
  }
  getInputAuthenticator(remediation) {
    return [{
      name: 'methodType',
      type: 'string'
    }, {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'string'
    }].map(item => {
      const value = remediation.form.value.find(val => val.name === item.name);
      return {
        ...value,
        ...item
      };
    });
  }
  mapAuthenticatorDataFromValues(data) {
    // get mapped authenticator from base class
    data = super.mapAuthenticatorDataFromValues(data);
    // add phoneNumber to authenticator if it exists in values
    const {
      phoneNumber
    } = this.values;
    if (!data && !phoneNumber) {
      return;
    }
    return {
      ...(data && data),
      ...(phoneNumber && {
        phoneNumber
      })
    };
  }
}
exports.AuthenticatorEnrollmentData = AuthenticatorEnrollmentData;
(0, _defineProperty2.default)(AuthenticatorEnrollmentData, "remediationName", 'authenticator-enrollment-data');
//# sourceMappingURL=AuthenticatorEnrollmentData.js.map