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

import Cookies from 'js-cookie';
import AuthSdkError from '../errors/AuthSdkError.js';
import { warn } from '../util/console.js';
import { isIE11OrLess } from '../features.js';

var storageUtil = {
    browserHasLocalStorage: function () {
        try {
            var storage = this.getLocalStorage();
            return this.testStorage(storage);
        }
        catch (e) {
            return false;
        }
    },
    browserHasSessionStorage: function () {
        try {
            var storage = this.getSessionStorage();
            return this.testStorage(storage);
        }
        catch (e) {
            return false;
        }
    },
    testStorageType: function (storageType) {
        var supported = false;
        switch (storageType) {
            case 'sessionStorage':
                supported = this.browserHasSessionStorage();
                break;
            case 'localStorage':
                supported = this.browserHasLocalStorage();
                break;
            case 'cookie':
            case 'memory':
                supported = true;
                break;
            default:
                supported = false;
                break;
        }
        return supported;
    },
    getStorageByType: function (storageType, options) {
        let storageProvider;
        switch (storageType) {
            case 'sessionStorage':
                storageProvider = this.getSessionStorage();
                break;
            case 'localStorage':
                storageProvider = this.getLocalStorage();
                break;
            case 'cookie':
                storageProvider = this.getCookieStorage(options);
                break;
            case 'memory':
                storageProvider = this.getInMemoryStorage();
                break;
            default:
                throw new AuthSdkError(`Unrecognized storage option: ${storageType}`);
        }
        return storageProvider;
    },
    findStorageType: function (types) {
        let curType;
        let nextType;
        types = types.slice();
        curType = types.shift();
        nextType = types.length ? types[0] : null;
        if (!nextType) {
            return curType;
        }
        if (this.testStorageType(curType)) {
            return curType;
        }
        warn(`This browser doesn't support ${curType}. Switching to ${nextType}.`);
        return this.findStorageType(types);
    },
    getLocalStorage: function () {
        if (isIE11OrLess() && !window.onstorage) {
            window.onstorage = function () { };
        }
        return localStorage;
    },
    getSessionStorage: function () {
        return sessionStorage;
    },
    getCookieStorage: function (options) {
        const secure = options.secure;
        const sameSite = options.sameSite;
        const sessionCookie = options.sessionCookie;
        if (typeof secure === 'undefined' || typeof sameSite === 'undefined') {
            throw new AuthSdkError('getCookieStorage: "secure" and "sameSite" options must be provided');
        }
        const storage = {
            getItem: this.storage.get,
            setItem: (key, value, expiresAt = '2200-01-01T00:00:00.000Z') => {
                expiresAt = (sessionCookie ? null : expiresAt);
                this.storage.set(key, value, expiresAt, {
                    secure: secure,
                    sameSite: sameSite,
                });
            },
            removeItem: (key) => {
                this.storage.delete(key);
            },
        };
        if (!options.useSeparateCookies) {
            return storage;
        }
        return {
            getItem: function (key) {
                var data = storage.getItem();
                var value = {};
                Object.keys(data).forEach(k => {
                    if (k.indexOf(key) === 0) {
                        value[k.replace(`${key}_`, '')] = JSON.parse(data[k]);
                    }
                });
                return JSON.stringify(value);
            },
            setItem: function (key, value) {
                var existingValues = JSON.parse(this.getItem(key));
                value = JSON.parse(value);
                Object.keys(value).forEach(k => {
                    var storageKey = key + '_' + k;
                    var valueToStore = JSON.stringify(value[k]);
                    storage.setItem(storageKey, valueToStore);
                    delete existingValues[k];
                });
                Object.keys(existingValues).forEach(k => {
                    storage.removeItem(key + '_' + k);
                });
            },
            removeItem: function (key) {
                var existingValues = JSON.parse(this.getItem(key));
                Object.keys(existingValues).forEach(k => {
                    storage.removeItem(key + '_' + k);
                });
            },
        };
    },
    inMemoryStore: {},
    getInMemoryStorage: function () {
        return {
            getItem: (key) => {
                return this.inMemoryStore[key];
            },
            setItem: (key, value) => {
                this.inMemoryStore[key] = value;
            },
        };
    },
    testStorage: function (storage) {
        var key = 'okta-test-storage';
        try {
            storage.setItem(key, key);
            storage.removeItem(key);
            return true;
        }
        catch (e) {
            return false;
        }
    },
    storage: {
        set: function (name, value, expiresAt, options) {
            const { sameSite, secure } = options;
            if (typeof secure === 'undefined' || typeof sameSite === 'undefined') {
                throw new AuthSdkError('storage.set: "secure" and "sameSite" options must be provided');
            }
            var cookieOptions = {
                path: options.path || '/',
                secure,
                sameSite
            };
            if (!!(Date.parse(expiresAt))) {
                cookieOptions.expires = new Date(expiresAt);
            }
            Cookies.set(name, value, cookieOptions);
            return this.get(name);
        },
        get: function (name) {
            if (!arguments.length) {
                return Cookies.get();
            }
            return Cookies.get(name);
        },
        delete: function (name) {
            return Cookies.remove(name, { path: '/' });
        }
    }
};

export { storageUtil as default };
//# sourceMappingURL=browserStorage.js.map
