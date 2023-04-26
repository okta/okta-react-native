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

import { AuthenticationFlow } from './AuthenticationFlow.js';
import { PasswordRecoveryFlow } from './PasswordRecoveryFlow.js';
import { RegistrationFlow } from './RegistrationFlow.js';
import { AccountUnlockFlow } from './AccountUnlockFlow.js';

function getFlowSpecification(oktaAuth, flow = 'default') {
    let remediators, actions, withCredentials = true;
    switch (flow) {
        case 'register':
        case 'signup':
        case 'enrollProfile':
            remediators = RegistrationFlow;
            withCredentials = false;
            break;
        case 'recoverPassword':
        case 'resetPassword':
            remediators = PasswordRecoveryFlow;
            actions = [
                'currentAuthenticator-recover',
                'currentAuthenticatorEnrollment-recover'
            ];
            withCredentials = false;
            break;
        case 'unlockAccount':
            remediators = AccountUnlockFlow;
            withCredentials = false;
            actions = [
                'unlock-account'
            ];
            break;
        case 'authenticate':
        case 'login':
        case 'signin':
            remediators = AuthenticationFlow;
            break;
        default:
            remediators = AuthenticationFlow;
            break;
    }
    return { flow, remediators, actions, withCredentials };
}

export { getFlowSpecification };
//# sourceMappingURL=FlowSpecification.js.map
