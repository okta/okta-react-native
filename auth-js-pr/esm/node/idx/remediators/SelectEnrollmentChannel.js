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

import { Remediator } from './Base/Remediator.js';

class SelectEnrollmentChannel extends Remediator {
    canRemediate() {
        if (this.values.channel) {
            return true;
        }
        if (this.values.authenticator) {
            const { id, channel } = this.values.authenticator;
            if (!!id && !!channel) {
                return true;
            }
        }
        return false;
    }
    getNextStep(authClient, context) {
        const common = super.getNextStep(authClient, context);
        const authenticator = context.currentAuthenticator.value;
        return Object.assign(Object.assign({}, common), { authenticator });
    }
    getData() {
        var _a;
        const remediationValue = this.remediation.value[0].value;
        return {
            authenticator: {
                id: remediationValue.form.value[0].value,
                channel: ((_a = this.values.authenticator) === null || _a === void 0 ? void 0 : _a.channel) || this.values.channel,
            },
            stateHandle: this.values.stateHandle,
        };
    }
    getValuesAfterProceed() {
        this.values = super.getValuesAfterProceed();
        delete this.values.authenticators;
        const filterKey = this.values.channel ? 'channel' : 'authenticator';
        let trimmedValues = Object.keys(this.values).filter(valueKey => valueKey !== filterKey);
        return trimmedValues.reduce((values, valueKey) => (Object.assign(Object.assign({}, values), { [valueKey]: this.values[valueKey] })), {});
    }
}
SelectEnrollmentChannel.remediationName = 'select-enrollment-channel';

export { SelectEnrollmentChannel };
//# sourceMappingURL=SelectEnrollmentChannel.js.map
