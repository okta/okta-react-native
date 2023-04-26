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

import { isTransactionMeta } from '../types/Transaction.js';

const MAX_ENTRY_LIFETIME = 30 * 60 * 1000;
function pruneSharedStorage(storageManager) {
    const sharedStorage = storageManager.getSharedTansactionStorage();
    const entries = sharedStorage.getStorage();
    Object.keys(entries).forEach(state => {
        const entry = entries[state];
        const age = Date.now() - entry.dateCreated;
        if (age > MAX_ENTRY_LIFETIME) {
            delete entries[state];
        }
    });
    sharedStorage.setStorage(entries);
}
function saveTransactionToSharedStorage(storageManager, state, meta) {
    const sharedStorage = storageManager.getSharedTansactionStorage();
    const entries = sharedStorage.getStorage();
    entries[state] = {
        dateCreated: Date.now(),
        transaction: meta
    };
    sharedStorage.setStorage(entries);
}
function loadTransactionFromSharedStorage(storageManager, state) {
    const sharedStorage = storageManager.getSharedTansactionStorage();
    const entries = sharedStorage.getStorage();
    const entry = entries[state];
    if (entry && entry.transaction && isTransactionMeta(entry.transaction)) {
        return entry.transaction;
    }
    return null;
}
function clearTransactionFromSharedStorage(storageManager, state) {
    const sharedStorage = storageManager.getSharedTansactionStorage();
    const entries = sharedStorage.getStorage();
    delete entries[state];
    sharedStorage.setStorage(entries);
}

export { clearTransactionFromSharedStorage, loadTransactionFromSharedStorage, pruneSharedStorage, saveTransactionToSharedStorage };
//# sourceMappingURL=sharedStorage.js.map
