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

import { sendRequest } from './request.js';

const getEmails = async (oktaAuth, options) => {
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/emails',
        method: 'GET',
        accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
        transactionClassName: 'EmailTransaction'
    });
    return transaction;
};
const getEmail = async (oktaAuth, options) => {
    const { id, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/emails/${id}`,
        method: 'GET',
        accessToken,
        transactionClassName: 'EmailTransaction'
    });
    return transaction;
};
const addEmail = async (oktaAuth, options) => {
    const { accessToken, payload } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/emails',
        method: 'POST',
        payload,
        accessToken,
        transactionClassName: 'EmailTransaction'
    });
    return transaction;
};
const deleteEmail = async (oktaAuth, options) => {
    const { id, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/emails/${id}`,
        method: 'DELETE',
        accessToken
    });
    return transaction;
};
const sendEmailChallenge = async (oktaAuth, options) => {
    const { id, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/emails/${id}/challenge`,
        method: 'POST',
        accessToken,
        transactionClassName: 'EmailChallengeTransaction'
    });
    return transaction;
};
const getEmailChallenge = async (oktaAuth, options) => {
    const { emailId, challengeId, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/emails/${emailId}/challenge/${challengeId}`,
        method: 'POST',
        accessToken,
        transactionClassName: 'EmailChallengeTransaction'
    });
    return transaction;
};
const verifyEmailChallenge = async (oktaAuth, options) => {
    const { emailId, challengeId, payload, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/emails/${emailId}/challenge/${challengeId}/verify`,
        method: 'POST',
        payload,
        accessToken
    });
    return transaction;
};

export { addEmail, deleteEmail, getEmail, getEmailChallenge, getEmails, sendEmailChallenge, verifyEmailChallenge };
//# sourceMappingURL=emailApi.js.map
