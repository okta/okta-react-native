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

import { TOKEN_STORAGE_NAME, CACHE_STORAGE_NAME } from '../constants.js';
import { SavedObject } from './SavedObject.js';
import { isBrowser } from '../features.js';
import { warn } from '../util/console.js';

function logServerSideMemoryStorageWarning(options) {
    if (!isBrowser() && !options.storageProvider && !options.storageKey) {
        warn('Memory storage can only support simple single user use case on server side, please provide custom storageProvider or storageKey if advanced scenarios need to be supported.');
    }
}
class BaseStorageManager {
    constructor(storageManagerOptions, cookieOptions, storageUtil) {
        this.storageManagerOptions = storageManagerOptions;
        this.cookieOptions = cookieOptions;
        this.storageUtil = storageUtil;
    }
    getOptionsForSection(sectionName, overrideOptions) {
        return Object.assign({}, this.storageManagerOptions[sectionName], overrideOptions);
    }
    getStorage(options) {
        options = Object.assign({}, this.cookieOptions, options);
        if (options.storageProvider) {
            return options.storageProvider;
        }
        let { storageType, storageTypes } = options;
        if (storageType === 'sessionStorage') {
            options.sessionCookie = true;
        }
        if (storageType && storageTypes) {
            const idx = storageTypes.indexOf(storageType);
            if (idx >= 0) {
                storageTypes = storageTypes.slice(idx);
                storageType = undefined;
            }
        }
        if (!storageType) {
            storageType = this.storageUtil.findStorageType(storageTypes);
        }
        return this.storageUtil.getStorageByType(storageType, options);
    }
    getTokenStorage(options) {
        options = this.getOptionsForSection('token', options);
        logServerSideMemoryStorageWarning(options);
        const storage = this.getStorage(options);
        const storageKey = options.storageKey || TOKEN_STORAGE_NAME;
        return new SavedObject(storage, storageKey);
    }
    getHttpCache(options) {
        options = this.getOptionsForSection('cache', options);
        const storage = this.getStorage(options);
        const storageKey = options.storageKey || CACHE_STORAGE_NAME;
        return new SavedObject(storage, storageKey);
    }
}

export { BaseStorageManager, logServerSideMemoryStorageWarning };
//# sourceMappingURL=BaseStorageManager.js.map
