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

import { isTransactionMeta } from './types/Transaction.js';
import { warn } from '../util/console.js';
import { clearTransactionFromSharedStorage, saveTransactionToSharedStorage, pruneSharedStorage, loadTransactionFromSharedStorage } from './util/sharedStorage.js';

function createTransactionManager() {
    return class TransactionManager {
        constructor(options) {
            this.storageManager = options.storageManager;
            this.enableSharedStorage = options.enableSharedStorage === false ? false : true;
            this.saveLastResponse = options.saveLastResponse === false ? false : true;
            this.options = options;
        }
        clear(options = {}) {
            const transactionStorage = this.storageManager.getTransactionStorage();
            const meta = transactionStorage.getStorage();
            transactionStorage.clearStorage();
            if (this.enableSharedStorage && options.clearSharedStorage !== false) {
                const state = options.state || (meta === null || meta === void 0 ? void 0 : meta.state);
                if (state) {
                    clearTransactionFromSharedStorage(this.storageManager, state);
                }
            }
        }
        save(meta, options = {}) {
            let storage = this.storageManager.getTransactionStorage();
            const obj = storage.getStorage();
            if (isTransactionMeta(obj) && !options.muteWarning) {
                warn('a saved auth transaction exists in storage. This may indicate another auth flow is already in progress.');
            }
            storage.setStorage(meta);
            if (this.enableSharedStorage && meta.state) {
                saveTransactionToSharedStorage(this.storageManager, meta.state, meta);
            }
        }
        exists(options = {}) {
            try {
                const meta = this.load(options);
                return !!meta;
            }
            catch (_a) {
                return false;
            }
        }
        load(options = {}) {
            let meta;
            if (this.enableSharedStorage && options.state) {
                pruneSharedStorage(this.storageManager);
                meta = loadTransactionFromSharedStorage(this.storageManager, options.state);
                if (isTransactionMeta(meta)) {
                    return meta;
                }
            }
            let storage = this.storageManager.getTransactionStorage();
            meta = storage.getStorage();
            if (isTransactionMeta(meta)) {
                return meta;
            }
            return null;
        }
    };
}

export { createTransactionManager };
//# sourceMappingURL=TransactionManager.js.map
