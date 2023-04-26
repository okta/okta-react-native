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

import AuthSdkError from '../errors/AuthSdkError.js';

class SavedObject {
    constructor(storage, storageName) {
        if (!storage) {
            throw new AuthSdkError('"storage" is required');
        }
        if (typeof storageName !== 'string' || !storageName.length) {
            throw new AuthSdkError('"storageName" is required');
        }
        this.storageName = storageName;
        this.storageProvider = storage;
    }
    getItem(key) {
        return this.getStorage()[key];
    }
    setItem(key, value) {
        return this.updateStorage(key, value);
    }
    removeItem(key) {
        return this.clearStorage(key);
    }
    getStorage() {
        var storageString = this.storageProvider.getItem(this.storageName);
        storageString = storageString || '{}';
        try {
            return JSON.parse(storageString);
        }
        catch (e) {
            throw new AuthSdkError('Unable to parse storage string: ' + this.storageName);
        }
    }
    setStorage(obj) {
        try {
            var storageString = obj ? JSON.stringify(obj) : '{}';
            this.storageProvider.setItem(this.storageName, storageString);
        }
        catch (e) {
            throw new AuthSdkError('Unable to set storage: ' + this.storageName);
        }
    }
    clearStorage(key) {
        if (!key) {
            if (this.storageProvider.removeItem) {
                this.storageProvider.removeItem(this.storageName);
            }
            else {
                this.setStorage();
            }
            return;
        }
        var obj = this.getStorage();
        delete obj[key];
        this.setStorage(obj);
    }
    updateStorage(key, value) {
        var obj = this.getStorage();
        obj[key] = value;
        this.setStorage(obj);
    }
}

export { SavedObject };
//# sourceMappingURL=SavedObject.js.map
