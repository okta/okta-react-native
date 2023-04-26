"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.SelectEnrollmentChannel = void 0;
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

class SelectEnrollmentChannel extends _Remediator.Remediator {
  canRemediate() {
    if (this.values.channel) {
      return true;
    }
    if (this.values.authenticator) {
      const {
        id,
        channel
      } = this.values.authenticator;
      if (!!id && !!channel) {
        return true;
      }
    }
    return false;
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
    var _this$values$authenti;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const remediationValue = this.remediation.value[0].value;
    return {
      authenticator: {
        id: remediationValue.form.value[0].value,
        channel: ((_this$values$authenti = this.values.authenticator) === null || _this$values$authenti === void 0 ? void 0 : _this$values$authenti.channel) || this.values.channel
      },
      stateHandle: this.values.stateHandle
    };
  }
  getValuesAfterProceed() {
    this.values = super.getValuesAfterProceed();
    delete this.values.authenticators; // required to prevent infinite loops from auto-remediating via values
    const filterKey = this.values.channel ? 'channel' : 'authenticator';
    let trimmedValues = Object.keys(this.values).filter(valueKey => valueKey !== filterKey);
    return trimmedValues.reduce((values, valueKey) => ({
      ...values,
      [valueKey]: this.values[valueKey]
    }), {});
  }
}
exports.SelectEnrollmentChannel = SelectEnrollmentChannel;
(0, _defineProperty2.default)(SelectEnrollmentChannel, "remediationName", 'select-enrollment-channel');
//# sourceMappingURL=SelectEnrollmentChannel.js.map