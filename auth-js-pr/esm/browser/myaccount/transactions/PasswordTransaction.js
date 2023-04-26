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

import { PasswordStatus } from '../types.js';
import BaseTransaction from './Base.js';
import { generateRequestFnFromLinks } from '../request.js';

class PasswordTransaction extends BaseTransaction {
    constructor(oktaAuth, options) {
        super(oktaAuth, options);
        const { res, accessToken } = options;
        const { id, status, created, lastUpdated, _links } = res;
        this.id = id;
        this.status = status;
        this.created = created;
        this.lastUpdated = lastUpdated;
        if (this.status == PasswordStatus.NOT_ENROLLED) {
            this.enroll = async (payload) => {
                const fn = generateRequestFnFromLinks({
                    oktaAuth,
                    accessToken,
                    methodName: 'enroll',
                    links: _links,
                    transactionClassName: 'PasswordTransaction'
                });
                return await fn(payload);
            };
        }
        else {
            this.get = async () => {
                const fn = generateRequestFnFromLinks({
                    oktaAuth,
                    accessToken,
                    methodName: 'get',
                    links: _links,
                    transactionClassName: 'PasswordTransaction'
                });
                return await fn();
            };
            this.update = async (payload) => {
                const fn = generateRequestFnFromLinks({
                    oktaAuth,
                    accessToken,
                    methodName: 'put',
                    links: _links,
                    transactionClassName: 'PasswordTransaction'
                });
                return await fn(payload);
            };
            this.delete = async () => {
                const fn = generateRequestFnFromLinks({
                    oktaAuth,
                    accessToken,
                    methodName: 'delete',
                    links: _links
                });
                return await fn();
            };
        }
    }
}

export { PasswordTransaction as default };
//# sourceMappingURL=PasswordTransaction.js.map
