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
import '../remediators/ChallengeAuthenticator.js';
import '../remediators/ChallengePoll.js';
import '../remediators/ResetAuthenticator.js';
import { EnrollProfile } from '../remediators/EnrollProfile.js';
import '../remediators/Identify.js';
import '../remediators/ReEnrollAuthenticator.js';
import '../remediators/RedirectIdp.js';
import '../remediators/SelectAuthenticatorAuthenticate.js';
import { SelectAuthenticatorEnroll } from '../remediators/SelectAuthenticatorEnroll.js';
import '../remediators/SelectAuthenticatorUnlockAccount.js';
import { SelectEnrollProfile } from '../remediators/SelectEnrollProfile.js';
import '../remediators/AuthenticatorVerificationData.js';
import { AuthenticatorEnrollmentData } from '../remediators/AuthenticatorEnrollmentData.js';
import { Skip } from '../remediators/Skip.js';

const RegistrationFlow = {
    'select-enroll-profile': SelectEnrollProfile,
    'enroll-profile': EnrollProfile,
    'authenticator-enrollment-data': AuthenticatorEnrollmentData,
    'select-authenticator-enroll': SelectAuthenticatorEnroll,
    'enroll-poll': EnrollPoll,
    'select-enrollment-channel': SelectEnrollmentChannel,
    'enrollment-channel-data': EnrollmentChannelData,
    'enroll-authenticator': EnrollAuthenticator,
    'skip': Skip,
};

export { RegistrationFlow };
//# sourceMappingURL=RegistrationFlow.js.map
