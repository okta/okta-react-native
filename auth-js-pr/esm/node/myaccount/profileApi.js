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

const getProfile = async (oktaAuth, options) => {
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/profile',
        method: 'GET',
        accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
        transactionClassName: 'ProfileTransaction'
    });
    return transaction;
};
const updateProfile = async (oktaAuth, options) => {
    const { payload, accessToken } = options;
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/profile',
        method: 'PUT',
        payload,
        accessToken,
        transactionClassName: 'ProfileTransaction'
    });
    return transaction;
};
const getProfileSchema = async (oktaAuth, options) => {
    const transaction = await sendRequest(oktaAuth, {
        url: '/idp/myaccount/profile/schema',
        method: 'GET',
        accessToken: options === null || options === void 0 ? void 0 : options.accessToken,
        transactionClassName: 'ProfileSchemaTransaction'
    });
    return transaction;
};

export { getProfile, getProfileSchema, updateProfile };
//# sourceMappingURL=profileApi.js.map
