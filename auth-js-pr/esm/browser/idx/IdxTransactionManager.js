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

import { createTransactionManager } from '../oidc/TransactionManager.js';
import { isRawIdxResponse } from './types/idx-js.js';

function createIdxTransactionManager() {
    const TransactionManager = createTransactionManager();
    return class IdxTransactionManager extends TransactionManager {
        constructor(options) {
            super(options);
        }
        clear(options = {}) {
            super.clear(options);
            if (options.clearIdxResponse !== false) {
                this.clearIdxResponse();
            }
        }
        saveIdxResponse(data) {
            if (!this.saveLastResponse) {
                return;
            }
            const storage = this.storageManager.getIdxResponseStorage();
            if (!storage) {
                return;
            }
            storage.setStorage(data);
        }
        loadIdxResponse(options) {
            if (!this.saveLastResponse) {
                return null;
            }
            const storage = this.storageManager.getIdxResponseStorage();
            if (!storage) {
                return null;
            }
            const storedValue = storage.getStorage();
            if (!storedValue || !isRawIdxResponse(storedValue.rawIdxResponse)) {
                return null;
            }
            if (options) {
                const { interactionHandle } = options;
                if (interactionHandle && storedValue.interactionHandle !== interactionHandle) {
                    return null;
                }
            }
            return storedValue;
        }
        clearIdxResponse() {
            if (!this.saveLastResponse) {
                return;
            }
            const storage = this.storageManager.getIdxResponseStorage();
            storage === null || storage === void 0 ? void 0 : storage.clearStorage();
        }
    };
}

export { createIdxTransactionManager };
//# sourceMappingURL=IdxTransactionManager.js.map
