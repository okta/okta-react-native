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

class ReEnrollAuthenticator extends Remediator {
    mapCredentials() {
        const { newPassword } = this.values;
        if (!newPassword) {
            return;
        }
        return {
            passcode: newPassword,
        };
    }
    getInputCredentials(input) {
        const challengeType = this.getAuthenticator().type;
        const name = challengeType === 'password' ? 'newPassword' : 'verificationCode';
        return Object.assign(Object.assign({}, input.form.value[0]), { name });
    }
}
ReEnrollAuthenticator.remediationName = 'reenroll-authenticator';

export { ReEnrollAuthenticator };
//# sourceMappingURL=ReEnrollAuthenticator.js.map
