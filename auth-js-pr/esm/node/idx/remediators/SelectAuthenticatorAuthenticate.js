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

import { SelectAuthenticator } from './Base/SelectAuthenticator.js';
import { getAuthenticatorFromRemediation } from './util.js';
import { AuthenticatorKey } from '../types/api.js';

class SelectAuthenticatorAuthenticate extends SelectAuthenticator {
    constructor(remediation, values = {}, options = {}) {
        var _a;
        super(remediation, values, options);
        const isRecoveryFlow = this.options.flow === 'recoverPassword';
        const hasPasswordInOptions = (_a = getAuthenticatorFromRemediation(remediation)
            .options) === null || _a === void 0 ? void 0 : _a.some(({ relatesTo }) => (relatesTo === null || relatesTo === void 0 ? void 0 : relatesTo.key) === AuthenticatorKey.OKTA_PASSWORD);
        if (hasPasswordInOptions && (isRecoveryFlow || this.values.password)) {
            this.values.authenticators = [
                ...this.values.authenticators || [],
                { key: AuthenticatorKey.OKTA_PASSWORD }
            ];
        }
    }
}
SelectAuthenticatorAuthenticate.remediationName = 'select-authenticator-authenticate';

export { SelectAuthenticatorAuthenticate };
//# sourceMappingURL=SelectAuthenticatorAuthenticate.js.map
