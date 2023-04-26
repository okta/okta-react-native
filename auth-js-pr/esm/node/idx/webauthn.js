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

import { base64UrlToBuffer, bufferToBase64Url } from '../crypto/base64.js';

const getEnrolledCredentials = (authenticatorEnrollments = []) => {
    const credentials = [];
    authenticatorEnrollments.forEach((enrollement) => {
        if (enrollement.key === 'webauthn') {
            credentials.push({
                type: 'public-key',
                id: base64UrlToBuffer(enrollement.credentialId),
            });
        }
    });
    return credentials;
};
const buildCredentialCreationOptions = (activationData, authenticatorEnrollments) => {
    return {
        publicKey: {
            rp: activationData.rp,
            user: {
                id: base64UrlToBuffer(activationData.user.id),
                name: activationData.user.name,
                displayName: activationData.user.displayName
            },
            challenge: base64UrlToBuffer(activationData.challenge),
            pubKeyCredParams: activationData.pubKeyCredParams,
            attestation: activationData.attestation,
            authenticatorSelection: activationData.authenticatorSelection,
            excludeCredentials: getEnrolledCredentials(authenticatorEnrollments),
        }
    };
};
const buildCredentialRequestOptions = (challengeData, authenticatorEnrollments) => {
    return {
        publicKey: {
            challenge: base64UrlToBuffer(challengeData.challenge),
            userVerification: challengeData.userVerification,
            allowCredentials: getEnrolledCredentials(authenticatorEnrollments),
        }
    };
};
const getAttestation = (credential) => {
    const response = credential.response;
    const id = credential.id;
    const clientData = bufferToBase64Url(response.clientDataJSON);
    const attestation = bufferToBase64Url(response.attestationObject);
    return {
        id,
        clientData,
        attestation
    };
};
const getAssertion = (credential) => {
    const response = credential.response;
    const id = credential.id;
    const clientData = bufferToBase64Url(response.clientDataJSON);
    const authenticatorData = bufferToBase64Url(response.authenticatorData);
    const signatureData = bufferToBase64Url(response.signature);
    return {
        id,
        clientData,
        authenticatorData,
        signatureData
    };
};

export { buildCredentialCreationOptions, buildCredentialRequestOptions, getAssertion, getAttestation };
//# sourceMappingURL=webauthn.js.map
