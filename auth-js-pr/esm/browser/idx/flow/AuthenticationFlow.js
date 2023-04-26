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
import { EnrollAuthenticator } from '../remediators/EnrollAuthenticator.js';
import { EnrollPoll } from '../remediators/EnrollPoll.js';
import { SelectEnrollmentChannel } from '../remediators/SelectEnrollmentChannel.js';
import { EnrollmentChannelData } from '../remediators/EnrollmentChannelData.js';
import { ChallengeAuthenticator } from '../remediators/ChallengeAuthenticator.js';
import { ChallengePoll } from '../remediators/ChallengePoll.js';
import '../remediators/ResetAuthenticator.js';
import '../remediators/EnrollProfile.js';
import { Identify } from '../remediators/Identify.js';
import { ReEnrollAuthenticator } from '../remediators/ReEnrollAuthenticator.js';
import { RedirectIdp } from '../remediators/RedirectIdp.js';
import { SelectAuthenticatorAuthenticate } from '../remediators/SelectAuthenticatorAuthenticate.js';
import { SelectAuthenticatorEnroll } from '../remediators/SelectAuthenticatorEnroll.js';
import '../remediators/SelectAuthenticatorUnlockAccount.js';
import '../remediators/SelectEnrollProfile.js';
import { AuthenticatorVerificationData } from '../remediators/AuthenticatorVerificationData.js';
import { AuthenticatorEnrollmentData } from '../remediators/AuthenticatorEnrollmentData.js';
import { Skip } from '../remediators/Skip.js';

const AuthenticationFlow = {
    'identify': Identify,
    'select-authenticator-authenticate': SelectAuthenticatorAuthenticate,
    'select-authenticator-enroll': SelectAuthenticatorEnroll,
    'authenticator-enrollment-data': AuthenticatorEnrollmentData,
    'authenticator-verification-data': AuthenticatorVerificationData,
    'enroll-authenticator': EnrollAuthenticator,
    'challenge-authenticator': ChallengeAuthenticator,
    'challenge-poll': ChallengePoll,
    'reenroll-authenticator': ReEnrollAuthenticator,
    'enroll-poll': EnrollPoll,
    'select-enrollment-channel': SelectEnrollmentChannel,
    'enrollment-channel-data': EnrollmentChannelData,
    'redirect-idp': RedirectIdp,
    'skip': Skip,
};

export { AuthenticationFlow };
//# sourceMappingURL=AuthenticationFlow.js.map
