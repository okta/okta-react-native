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

import { AuthenticatorData } from './Base/AuthenticatorData.js';
import { getAuthenticatorFromRemediation } from './util.js';

class AuthenticatorEnrollmentData extends AuthenticatorData {
    mapAuthenticator() {
        const authenticatorData = this.getAuthenticatorData();
        const authenticatorFromRemediation = getAuthenticatorFromRemediation(this.remediation);
        return {
            id: authenticatorFromRemediation.form.value
                .find(({ name }) => name === 'id').value,
            methodType: authenticatorData.methodType,
            phoneNumber: authenticatorData.phoneNumber,
        };
    }
    getInputAuthenticator(remediation) {
        return [
            { name: 'methodType', type: 'string' },
            { name: 'phoneNumber', label: 'Phone Number', type: 'string' }
        ].map(item => {
            const value = remediation.form.value.find(val => val.name === item.name);
            return Object.assign(Object.assign({}, value), item);
        });
    }
    mapAuthenticatorDataFromValues(data) {
        data = super.mapAuthenticatorDataFromValues(data);
        const { phoneNumber } = this.values;
        if (!data && !phoneNumber) {
            return;
        }
        return Object.assign(Object.assign({}, (data && data)), (phoneNumber && { phoneNumber }));
    }
}
AuthenticatorEnrollmentData.remediationName = 'authenticator-enrollment-data';

export { AuthenticatorEnrollmentData };
//# sourceMappingURL=AuthenticatorEnrollmentData.js.map
