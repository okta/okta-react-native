"use strict";

exports.AccountUnlockFlow = void 0;
var _remediators = require("../remediators");
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

const AccountUnlockFlow = {
  'identify': _remediators.Identify,
  // NOTE: unlock-account is purposely not included. Handled as action
  // because it's a rememdiation which requires no input
  // 'unlock-account': UnlockAccount,
  'select-authenticator-unlock-account': _remediators.SelectAuthenticatorUnlockAccount,
  'select-authenticator-authenticate': _remediators.SelectAuthenticatorAuthenticate,
  'challenge-authenticator': _remediators.ChallengeAuthenticator,
  'challenge-poll': _remediators.ChallengePoll,
  'authenticator-verification-data': _remediators.AuthenticatorVerificationData
};
exports.AccountUnlockFlow = AccountUnlockFlow;
//# sourceMappingURL=AccountUnlockFlow.js.map