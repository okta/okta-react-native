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

const getPhones = async (oktaAuth, options) => {
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/phones',
        method: 'GET',
        accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
        transactionClassName: 'PhoneTransaction'
    });
    return transaction;
};
const getPhone = async (oktaAuth, options) => {
    const { accessToken, id } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/phones/${id}`,
        method: 'GET',
        accessToken,
        transactionClassName: 'PhoneTransaction'
    });
    return transaction;
};
const addPhone = async (oktaAuth, options) => {
    const { accessToken, payload } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/phones',
        method: 'POST',
        payload,
        accessToken,
        transactionClassName: 'PhoneTransaction'
    });
    return transaction;
};
const deletePhone = async (oktaAuth, options) => {
    const { id, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/phones/${id}`,
        method: 'DELETE',
        accessToken,
    });
    return transaction;
};
const sendPhoneChallenge = async (oktaAuth, options) => {
    const { accessToken, id, payload } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/phones/${id}/challenge`,
        method: 'POST',
        payload,
        accessToken
    });
    return transaction;
};
const verifyPhoneChallenge = async (oktaAuth, options) => {
    const { id, payload, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/phones/${id}/verify`,
        method: 'POST',
        payload,
        accessToken
    });
    return transaction;
};

export { addPhone, deletePhone, getPhone, getPhones, sendPhoneChallenge, verifyPhoneChallenge };
//# sourceMappingURL=phoneApi.js.map
