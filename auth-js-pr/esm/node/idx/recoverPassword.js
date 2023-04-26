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

import { run } from './run.js';
import './types/api.js';
import './remediators/EnrollAuthenticator.js';
import './remediators/EnrollPoll.js';
import './remediators/SelectEnrollmentChannel.js';
import './remediators/EnrollmentChannelData.js';
import './remediators/ChallengeAuthenticator.js';
import './remediators/ChallengePoll.js';
import './remediators/ResetAuthenticator.js';
import './remediators/EnrollProfile.js';
import './remediators/Identify.js';
import './remediators/ReEnrollAuthenticator.js';
import './remediators/RedirectIdp.js';
import './remediators/SelectAuthenticatorAuthenticate.js';
import './remediators/SelectAuthenticatorEnroll.js';
import './remediators/SelectAuthenticatorUnlockAccount.js';
import './remediators/SelectEnrollProfile.js';
import './remediators/AuthenticatorVerificationData.js';
import './remediators/AuthenticatorEnrollmentData.js';
import './remediators/Skip.js';
import { getFlowSpecification } from './flow/FlowSpecification.js';

async function recoverPassword(authClient, options = {}) {
    const flowSpec = getFlowSpecification(authClient, 'recoverPassword');
    return run(authClient, Object.assign(Object.assign({}, options), flowSpec));
}

export { recoverPassword };
//# sourceMappingURL=recoverPassword.js.map
