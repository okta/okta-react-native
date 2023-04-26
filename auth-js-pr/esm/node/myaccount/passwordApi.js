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

const getPassword = async (oktaAuth, options) => {
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/password`,
        method: 'GET',
        accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
        transactionClassName: 'PasswordTransaction'
    });
    return transaction;
};
const enrollPassword = async (oktaAuth, options) => {
    const { accessToken, payload } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/password',
        method: 'POST',
        payload,
        accessToken,
        transactionClassName: 'PasswordTransaction'
    });
    return transaction;
};
const updatePassword = async (oktaAuth, options) => {
    const { accessToken, payload } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/password',
        method: 'PUT',
        payload,
        accessToken,
        transactionClassName: 'PasswordTransaction'
    });
    return transaction;
};
const deletePassword = async (oktaAuth, options) => {
    const transaction = await sendRequest(oktaAuth, {
        url: `/idp/myaccount/password`,
        method: 'DELETE',
        accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
    });
    return transaction;
};

export { deletePassword, enrollPassword, getPassword, updatePassword };
//# sourceMappingURL=passwordApi.js.map
