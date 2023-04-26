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

import { Remediator } from './Remediator.js';
import { getAuthenticator } from '../../authenticator/getAuthenticator.js';

class VerifyAuthenticator extends Remediator {
    constructor(remediation, values = {}) {
        super(remediation, values);
        this.authenticator = getAuthenticator(remediation);
    }
    getNextStep(authClient, context) {
        var _a;
        const nextStep = super.getNextStep(authClient, context);
        const authenticatorEnrollments = (_a = context === null || context === void 0 ? void 0 : context.authenticatorEnrollments) === null || _a === void 0 ? void 0 : _a.value;
        return Object.assign(Object.assign({}, nextStep), { authenticatorEnrollments });
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
        return trimmedValues.reduce((values, valueKey) => (Object.assign(Object.assign({}, values), { [valueKey]: this.values[valueKey] })), {});
    }
}

export { VerifyAuthenticator };
//# sourceMappingURL=VerifyAuthenticator.js.map
