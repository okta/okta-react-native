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

var IdxStatus;
(function (IdxStatus) {
    IdxStatus["SUCCESS"] = "SUCCESS";
    IdxStatus["PENDING"] = "PENDING";
    IdxStatus["FAILURE"] = "FAILURE";
    IdxStatus["TERMINAL"] = "TERMINAL";
    IdxStatus["CANCELED"] = "CANCELED";
})(IdxStatus || (IdxStatus = {}));
var AuthenticatorKey;
(function (AuthenticatorKey) {
    AuthenticatorKey["OKTA_PASSWORD"] = "okta_password";
    AuthenticatorKey["OKTA_EMAIL"] = "okta_email";
    AuthenticatorKey["PHONE_NUMBER"] = "phone_number";
    AuthenticatorKey["GOOGLE_AUTHENTICATOR"] = "google_otp";
    AuthenticatorKey["SECURITY_QUESTION"] = "security_question";
    AuthenticatorKey["OKTA_VERIFY"] = "okta_verify";
    AuthenticatorKey["WEBAUTHN"] = "webauthn";
})(AuthenticatorKey || (AuthenticatorKey = {}));
var IdxFeature;
(function (IdxFeature) {
    IdxFeature["PASSWORD_RECOVERY"] = "recover-password";
    IdxFeature["REGISTRATION"] = "enroll-profile";
    IdxFeature["SOCIAL_IDP"] = "redirect-idp";
    IdxFeature["ACCOUNT_UNLOCK"] = "unlock-account";
})(IdxFeature || (IdxFeature = {}));
function isAuthenticator(obj) {
    return obj && (obj.key || obj.id);
}

export { AuthenticatorKey, IdxFeature, IdxStatus, isAuthenticator };
//# sourceMappingURL=api.js.map
