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

import NodeCache from 'node-cache';
import AuthSdkError from '../errors/AuthSdkError.js';

const sharedStorage = typeof NodeCache === 'function' ? new NodeCache() : null;
class ServerCookies {
    constructor(nodeCache) {
        this.nodeCache = nodeCache;
    }
    set(name, value, expiresAt) {
        if (!!(Date.parse(expiresAt))) {
            var ttl = (Date.parse(expiresAt) - Date.now()) / 1000;
            this.nodeCache.set(name, value, ttl);
        }
        else {
            this.nodeCache.set(name, value);
        }
        return this.get(name);
    }
    get(name) {
        return this.nodeCache.get(name);
    }
    delete(name) {
        return this.nodeCache.del(name);
    }
}
class ServerStorage {
    constructor(nodeCache) {
        this.nodeCache = nodeCache;
        this.storage = new ServerCookies(nodeCache);
    }
    testStorageType(storageType) {
        var supported = false;
        switch (storageType) {
            case 'memory':
                supported = true;
                break;
        }
        return supported;
    }
    getStorageByType(storageType) {
        let storageProvider;
        switch (storageType) {
            case 'memory':
                storageProvider = this.getStorage();
                break;
            default:
                throw new AuthSdkError(`Unrecognized storage option: ${storageType}`);
        }
        return storageProvider;
    }
    findStorageType() {
        return 'memory';
    }
    getStorage() {
        return {
            getItem: this.nodeCache.get,
            setItem: (key, value) => {
                this.nodeCache.set(key, value, '2200-01-01T00:00:00.000Z');
            },
        };
    }
}
var storage = new ServerStorage(sharedStorage);

export { storage as default };
//# sourceMappingURL=serverStorage.js.map
