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

import '../types/api.js';
import '../remediators/EnrollAuthenticator.js';
import '../remediators/EnrollPoll.js';
import '../remediators/SelectEnrollmentChannel.js';
import '../remediators/EnrollmentChannelData.js';
import { ChallengeAuthenticator } from '../remediators/ChallengeAuthenticator.js';
import { ChallengePoll } from '../remediators/ChallengePoll.js';
import '../remediators/ResetAuthenticator.js';
import '../remediators/EnrollProfile.js';
import { Identify } from '../remediators/Identify.js';
import '../remediators/ReEnrollAuthenticator.js';
import '../remediators/RedirectIdp.js';
import { SelectAuthenticatorAuthenticate } from '../remediators/SelectAuthenticatorAuthenticate.js';
import '../remediators/SelectAuthenticatorEnroll.js';
import { SelectAuthenticatorUnlockAccount } from '../remediators/SelectAuthenticatorUnlockAccount.js';
import '../remediators/SelectEnrollProfile.js';
import { AuthenticatorVerificationData } from '../remediators/AuthenticatorVerificationData.js';
import '../remediators/AuthenticatorEnrollmentData.js';
import '../remediators/Skip.js';

const AccountUnlockFlow = {
    'identify': Identify,
    'select-authenticator-unlock-account': SelectAuthenticatorUnlockAccount,
    'select-authenticator-authenticate': SelectAuthenticatorAuthenticate,
    'challenge-authenticator': ChallengeAuthenticator,
    'challenge-poll': ChallengePoll,
    'authenticator-verification-data': AuthenticatorVerificationData,
};

export { AccountUnlockFlow };
//# sourceMappingURL=AccountUnlockFlow.js.map
