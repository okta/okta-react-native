"use strict";

exports.getAttestation = exports.getAssertion = exports.buildCredentialRequestOptions = exports.buildCredentialCreationOptions = void 0;
var _base = require("../crypto/base64");
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

// Get known credentials from list of enrolled authenticators
const getEnrolledCredentials = (authenticatorEnrollments = []) => {
  const credentials = [];
  authenticatorEnrollments.forEach(enrollement => {
    if (enrollement.key === 'webauthn') {
      credentials.push({
        type: 'public-key',
        id: (0, _base.base64UrlToBuffer)(enrollement.credentialId)
      });
    }
  });
  return credentials;
};

// Build options for navigator.credentials.create
// https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create
const buildCredentialCreationOptions = (activationData, authenticatorEnrollments) => {
  return {
    publicKey: {
      rp: activationData.rp,
      user: {
        id: (0, _base.base64UrlToBuffer)(activationData.user.id),
        name: activationData.user.name,
        displayName: activationData.user.displayName
      },
      challenge: (0, _base.base64UrlToBuffer)(activationData.challenge),
      pubKeyCredParams: activationData.pubKeyCredParams,
      attestation: activationData.attestation,
      authenticatorSelection: activationData.authenticatorSelection,
      excludeCredentials: getEnrolledCredentials(authenticatorEnrollments)
    }
  };
};

// Build options for navigator.credentials.get
// https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get
exports.buildCredentialCreationOptions = buildCredentialCreationOptions;
const buildCredentialRequestOptions = (challengeData, authenticatorEnrollments) => {
  return {
    publicKey: {
      challenge: (0, _base.base64UrlToBuffer)(challengeData.challenge),
      userVerification: challengeData.userVerification,
      allowCredentials: getEnrolledCredentials(authenticatorEnrollments)
    }
  };
};

// Build attestation for webauthn enroll
// https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse
exports.buildCredentialRequestOptions = buildCredentialRequestOptions;
const getAttestation = credential => {
  const response = credential.response;
  const id = credential.id;
  const clientData = (0, _base.bufferToBase64Url)(response.clientDataJSON);
  const attestation = (0, _base.bufferToBase64Url)(response.attestationObject);
  return {
    id,
    clientData,
    attestation
  };
};

// Build assertion for webauthn verification
// https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse
exports.getAttestation = getAttestation;
const getAssertion = credential => {
  const response = credential.response;
  const id = credential.id;
  const clientData = (0, _base.bufferToBase64Url)(response.clientDataJSON);
  const authenticatorData = (0, _base.bufferToBase64Url)(response.authenticatorData);
  const signatureData = (0, _base.bufferToBase64Url)(response.signature);
  return {
    id,
    clientData,
    authenticatorData,
    signatureData
  };
};
exports.getAssertion = getAssertion;
//# sourceMappingURL=webauthn.js.map