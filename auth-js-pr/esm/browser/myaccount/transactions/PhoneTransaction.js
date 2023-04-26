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

import BaseTransaction from './Base.js';
import { generateRequestFnFromLinks } from '../request.js';

class PhoneTransaction extends BaseTransaction {
    constructor(oktaAuth, options) {
        super(oktaAuth, options);
        const { res, accessToken } = options;
        const { id, profile, status, _links } = res;
        this.id = id;
        this.profile = profile;
        this.status = status;
        this.get = async () => {
            const fn = generateRequestFnFromLinks({
                oktaAuth,
                accessToken,
                methodName: 'get',
                links: _links,
                transactionClassName: 'PhoneTransaction'
            });
            return await fn();
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
        this.challenge = async (payload) => {
            const fn = generateRequestFnFromLinks({
                oktaAuth,
                accessToken,
                methodName: 'challenge',
                links: _links
            });
            return await fn(payload);
        };
        if (_links.verify) {
            this.verify = async (payload) => {
                const fn = generateRequestFnFromLinks({
                    oktaAuth,
                    accessToken,
                    methodName: 'verify',
                    links: _links
                });
                return await fn(payload);
            };
        }
    }
}

export { PhoneTransaction as default };
//# sourceMappingURL=PhoneTransaction.js.map
