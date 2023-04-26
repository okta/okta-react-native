"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.EnrollmentChannelData = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Remediator = require("./Base/Remediator");
/*!
 * Copyright (c) 2021-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */

class EnrollmentChannelData extends _Remediator.Remediator {
  getInputEmail() {
    return [{
      name: 'email',
      type: 'string',
      required: true,
      label: 'Email'
    }];
  }
  getInputPhoneNumber() {
    return [{
      name: 'phoneNumber',
      type: 'string',
      required: true,
      label: 'Phone Number'
    }];
  }
  canRemediate() {
    return Boolean(this.values.email || this.values.phoneNumber);
  }
  getNextStep(authClient, context) {
    const common = super.getNextStep(authClient, context);
    const authenticator = context.currentAuthenticator.value;
    return {
      ...common,
      authenticator
    };
  }
  getData() {
    return {
      stateHandle: this.values.stateHandle,
      email: this.values.email,
      phoneNumber: this.values.phoneNumber
    };
  }
  getValuesAfterProceed() {
    let trimmedValues = Object.keys(this.values).filter(valueKey => !['email', 'phoneNumber'].includes(valueKey));
    return trimmedValues.reduce((values, valueKey) => ({
      ...values,
      [valueKey]: this.values[valueKey]
    }), {});
  }
}
exports.EnrollmentChannelData = EnrollmentChannelData;
(0, _defineProperty2.default)(EnrollmentChannelData, "remediationName", 'enrollment-channel-data');
//# sourceMappingURL=EnrollmentChannelData.js.map