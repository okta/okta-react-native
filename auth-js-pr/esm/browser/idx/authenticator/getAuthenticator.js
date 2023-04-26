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

import { OktaVerifyTotp } from './OktaVerifyTotp.js';
import { VerificationCodeAuthenticator } from './VerificationCodeAuthenticator.js';
import { OktaPassword } from './OktaPassword.js';
import { SecurityQuestionEnrollment } from './SecurityQuestionEnrollment.js';
import { SecurityQuestionVerification } from './SecurityQuestionVerification.js';
import { WebauthnEnrollment } from './WebauthnEnrollment.js';
import { WebauthnVerification } from './WebauthnVerification.js';
import { AuthenticatorKey } from '../types/api.js';

function getAuthenticator(remediation) {
    var _a, _b;
    const relatesTo = remediation.relatesTo;
    const value = (relatesTo === null || relatesTo === void 0 ? void 0 : relatesTo.value) || {};
    switch (value.key) {
        case AuthenticatorKey.OKTA_PASSWORD:
            return new OktaPassword(value);
        case AuthenticatorKey.SECURITY_QUESTION:
            if ((_a = value.contextualData) === null || _a === void 0 ? void 0 : _a.enrolledQuestion) {
                return new SecurityQuestionVerification(value);
            }
            else {
                return new SecurityQuestionEnrollment(value);
            }
        case AuthenticatorKey.OKTA_VERIFY:
            return new OktaVerifyTotp(value);
        case AuthenticatorKey.WEBAUTHN:
            if ((_b = value.contextualData) === null || _b === void 0 ? void 0 : _b.challengeData) {
                return new WebauthnVerification(value);
            }
            else {
                return new WebauthnEnrollment(value);
            }
        default:
            return new VerificationCodeAuthenticator(value);
    }
}

export { getAuthenticator };
//# sourceMappingURL=getAuthenticator.js.map
