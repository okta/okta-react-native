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

import { REFERRER_PATH_STORAGE_KEY } from '../../constants.js';
import storageUtil from '../../browser/browserStorage.js';

function provideOriginalUri(BaseClass) {
    return class WithOriginalUri extends BaseClass {
        setOriginalUri(originalUri, state) {
            const sessionStorage = storageUtil.getSessionStorage();
            sessionStorage.setItem(REFERRER_PATH_STORAGE_KEY, originalUri);
            state = state || this.options.state;
            if (state) {
                const sharedStorage = this.storageManager.getOriginalUriStorage();
                sharedStorage.setItem(state, originalUri);
            }
        }
        getOriginalUri(state) {
            state = state || this.options.state;
            if (state) {
                const sharedStorage = this.storageManager.getOriginalUriStorage();
                const originalUri = sharedStorage.getItem(state);
                if (originalUri) {
                    return originalUri;
                }
            }
            const storage = storageUtil.getSessionStorage();
            return storage ? storage.getItem(REFERRER_PATH_STORAGE_KEY) || undefined : undefined;
        }
        removeOriginalUri(state) {
            const storage = storageUtil.getSessionStorage();
            storage.removeItem(REFERRER_PATH_STORAGE_KEY);
            state = state || this.options.state;
            if (state) {
                const sharedStorage = this.storageManager.getOriginalUriStorage();
                sharedStorage.removeItem && sharedStorage.removeItem(state);
            }
        }
    };
}

export { provideOriginalUri };
//# sourceMappingURL=browser.js.map
