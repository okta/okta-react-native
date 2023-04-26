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

import { BaseStorageManager, logServerSideMemoryStorageWarning } from '../storage/BaseStorageManager.js';
import { TRANSACTION_STORAGE_NAME, SHARED_TRANSACTION_STORAGE_NAME, ORIGINAL_URI_STORAGE_NAME } from '../constants.js';
import 'tiny-emitter';
import 'js-cookie';
import { SavedObject } from '../storage/SavedObject.js';

function createOAuthStorageManager() {
    return class OAuthStorageManager extends BaseStorageManager {
        constructor(storageManagerOptions, cookieOptions, storageUtil) {
            super(storageManagerOptions, cookieOptions, storageUtil);
        }
        getTransactionStorage(options) {
            options = this.getOptionsForSection('transaction', options);
            logServerSideMemoryStorageWarning(options);
            const storage = this.getStorage(options);
            const storageKey = options.storageKey || TRANSACTION_STORAGE_NAME;
            return new SavedObject(storage, storageKey);
        }
        getSharedTansactionStorage(options) {
            options = this.getOptionsForSection('shared-transaction', options);
            logServerSideMemoryStorageWarning(options);
            const storage = this.getStorage(options);
            const storageKey = options.storageKey || SHARED_TRANSACTION_STORAGE_NAME;
            return new SavedObject(storage, storageKey);
        }
        getOriginalUriStorage(options) {
            options = this.getOptionsForSection('original-uri', options);
            logServerSideMemoryStorageWarning(options);
            const storage = this.getStorage(options);
            const storageKey = options.storageKey || ORIGINAL_URI_STORAGE_NAME;
            return new SavedObject(storage, storageKey);
        }
    };
}

export { createOAuthStorageManager };
//# sourceMappingURL=storage.js.map
