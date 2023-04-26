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

import { createSessionApi } from './factory.js';

function mixinSession(Base) {
    return class OktaAuthSession extends Base {
        constructor(...args) {
            super(...args);
            this.session = createSessionApi(this);
        }
        closeSession() {
            return this.session.close()
                .then(async () => {
                this.clearStorage();
                return true;
            })
                .catch(function (e) {
                if (e.name === 'AuthApiError' && e.errorCode === 'E0000007') {
                    return false;
                }
                throw e;
            });
        }
    };
}

export { mixinSession };
//# sourceMappingURL=mixin.js.map
