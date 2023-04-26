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

import { removeNils, clone } from '../util/object.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import { isLocalhost, isIE11OrLess } from '../features.js';
import '../crypto/node.js';
import { REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_NAME } from '../constants.js';
import 'tiny-emitter';
import '../server/serverStorage.js';
import 'cross-fetch';
import { validateToken } from './util/validateToken.js';
import SdkClock from '../clock.js';
import { isRefreshToken, isAccessToken, isIDToken } from './types/Token.js';
import { EVENT_EXPIRED, EVENT_RENEWED, EVENT_ADDED, EVENT_REMOVED, EVENT_ERROR, EVENT_SET_STORAGE } from './types/TokenManager.js';

const DEFAULT_OPTIONS = {
    autoRenew: true,
    autoRemove: true,
    syncStorage: true,
    clearPendingRemoveTokens: true,
    storage: undefined,
    expireEarlySeconds: 30,
    storageKey: TOKEN_STORAGE_NAME
};
function defaultState() {
    return {
        expireTimeouts: {},
        renewPromise: null
    };
}
class TokenManager {
    constructor(sdk, options = {}) {
        this.sdk = sdk;
        this.emitter = sdk.emitter;
        if (!this.emitter) {
            throw new AuthSdkError('Emitter should be initialized before TokenManager');
        }
        options = Object.assign({}, DEFAULT_OPTIONS, removeNils(options));
        if (!isLocalhost()) {
            options.expireEarlySeconds = DEFAULT_OPTIONS.expireEarlySeconds;
        }
        this.options = options;
        const storageOptions = removeNils({
            storageKey: options.storageKey,
            secure: options.secure,
        });
        if (typeof options.storage === 'object') {
            storageOptions.storageProvider = options.storage;
        }
        else if (options.storage) {
            storageOptions.storageType = options.storage;
        }
        this.storage = sdk.storageManager.getTokenStorage(Object.assign(Object.assign({}, storageOptions), { useSeparateCookies: true }));
        this.clock = SdkClock.create( );
        this.state = defaultState();
    }
    on(event, handler, context) {
        if (context) {
            this.emitter.on(event, handler, context);
        }
        else {
            this.emitter.on(event, handler);
        }
    }
    off(event, handler) {
        if (handler) {
            this.emitter.off(event, handler);
        }
        else {
            this.emitter.off(event);
        }
    }
    start() {
        if (this.options.clearPendingRemoveTokens) {
            this.clearPendingRemoveTokens();
        }
        this.setExpireEventTimeoutAll();
        this.state.started = true;
    }
    stop() {
        this.clearExpireEventTimeoutAll();
        this.state.started = false;
    }
    isStarted() {
        return !!this.state.started;
    }
    getOptions() {
        return clone(this.options);
    }
    getExpireTime(token) {
        const expireEarlySeconds = this.options.expireEarlySeconds || 0;
        var expireTime = token.expiresAt - expireEarlySeconds;
        return expireTime;
    }
    hasExpired(token) {
        var expireTime = this.getExpireTime(token);
        return expireTime <= this.clock.now();
    }
    emitExpired(key, token) {
        this.emitter.emit(EVENT_EXPIRED, key, token);
    }
    emitRenewed(key, freshToken, oldToken) {
        this.emitter.emit(EVENT_RENEWED, key, freshToken, oldToken);
    }
    emitAdded(key, token) {
        this.emitter.emit(EVENT_ADDED, key, token);
    }
    emitRemoved(key, token) {
        this.emitter.emit(EVENT_REMOVED, key, token);
    }
    emitError(error) {
        this.emitter.emit(EVENT_ERROR, error);
    }
    clearExpireEventTimeout(key) {
        clearTimeout(this.state.expireTimeouts[key]);
        delete this.state.expireTimeouts[key];
        this.state.renewPromise = null;
    }
    clearExpireEventTimeoutAll() {
        var expireTimeouts = this.state.expireTimeouts;
        for (var key in expireTimeouts) {
            if (!Object.prototype.hasOwnProperty.call(expireTimeouts, key)) {
                continue;
            }
            this.clearExpireEventTimeout(key);
        }
    }
    setExpireEventTimeout(key, token) {
        if (isRefreshToken(token)) {
            return;
        }
        var expireTime = this.getExpireTime(token);
        var expireEventWait = Math.max(expireTime - this.clock.now(), 0) * 1000;
        this.clearExpireEventTimeout(key);
        var expireEventTimeout = setTimeout(() => {
            this.emitExpired(key, token);
        }, expireEventWait);
        this.state.expireTimeouts[key] = expireEventTimeout;
    }
    setExpireEventTimeoutAll() {
        var tokenStorage = this.storage.getStorage();
        for (var key in tokenStorage) {
            if (!Object.prototype.hasOwnProperty.call(tokenStorage, key)) {
                continue;
            }
            var token = tokenStorage[key];
            this.setExpireEventTimeout(key, token);
        }
    }
    resetExpireEventTimeoutAll() {
        this.clearExpireEventTimeoutAll();
        this.setExpireEventTimeoutAll();
    }
    add(key, token) {
        var tokenStorage = this.storage.getStorage();
        validateToken(token);
        tokenStorage[key] = token;
        this.storage.setStorage(tokenStorage);
        this.emitSetStorageEvent();
        this.emitAdded(key, token);
        this.setExpireEventTimeout(key, token);
    }
    getSync(key) {
        var tokenStorage = this.storage.getStorage();
        return tokenStorage[key];
    }
    async get(key) {
        return this.getSync(key);
    }
    getTokensSync() {
        const tokens = {};
        const tokenStorage = this.storage.getStorage();
        Object.keys(tokenStorage).forEach(key => {
            const token = tokenStorage[key];
            if (isAccessToken(token)) {
                tokens.accessToken = token;
            }
            else if (isIDToken(token)) {
                tokens.idToken = token;
            }
            else if (isRefreshToken(token)) {
                tokens.refreshToken = token;
            }
        });
        return tokens;
    }
    async getTokens() {
        return this.getTokensSync();
    }
    getStorageKeyByType(type) {
        const tokenStorage = this.storage.getStorage();
        const key = Object.keys(tokenStorage).filter(key => {
            const token = tokenStorage[key];
            return (isAccessToken(token) && type === 'accessToken')
                || (isIDToken(token) && type === 'idToken')
                || (isRefreshToken(token) && type === 'refreshToken');
        })[0];
        return key;
    }
    getTokenType(token) {
        if (isAccessToken(token)) {
            return 'accessToken';
        }
        if (isIDToken(token)) {
            return 'idToken';
        }
        if (isRefreshToken(token)) {
            return 'refreshToken';
        }
        throw new AuthSdkError('Unknown token type');
    }
    emitSetStorageEvent() {
        if (isIE11OrLess()) {
            const storage = this.storage.getStorage();
            this.emitter.emit(EVENT_SET_STORAGE, storage);
        }
    }
    getStorage() {
        return this.storage;
    }
    setTokens(tokens,
    accessTokenCb, idTokenCb, refreshTokenCb) {
        const handleTokenCallback = (key, token) => {
            const type = this.getTokenType(token);
            if (type === 'accessToken') {
                accessTokenCb && accessTokenCb(key, token);
            }
            else if (type === 'idToken') {
                idTokenCb && idTokenCb(key, token);
            }
            else if (type === 'refreshToken') {
                refreshTokenCb && refreshTokenCb(key, token);
            }
        };
        const handleAdded = (key, token) => {
            this.emitAdded(key, token);
            this.setExpireEventTimeout(key, token);
            handleTokenCallback(key, token);
        };
        const handleRenewed = (key, token, oldToken) => {
            this.emitRenewed(key, token, oldToken);
            this.clearExpireEventTimeout(key);
            this.setExpireEventTimeout(key, token);
            handleTokenCallback(key, token);
        };
        const handleRemoved = (key, token) => {
            this.clearExpireEventTimeout(key);
            this.emitRemoved(key, token);
            handleTokenCallback(key, token);
        };
        const types = ['idToken', 'accessToken', 'refreshToken'];
        const existingTokens = this.getTokensSync();
        types.forEach((type) => {
            const token = tokens[type];
            if (token) {
                validateToken(token, type);
            }
        });
        const storage = types.reduce((storage, type) => {
            const token = tokens[type];
            if (token) {
                const storageKey = this.getStorageKeyByType(type) || type;
                storage[storageKey] = token;
            }
            return storage;
        }, {});
        this.storage.setStorage(storage);
        this.emitSetStorageEvent();
        types.forEach(type => {
            const newToken = tokens[type];
            const existingToken = existingTokens[type];
            const storageKey = this.getStorageKeyByType(type) || type;
            if (newToken && existingToken) {
                handleRemoved(storageKey, existingToken);
                handleAdded(storageKey, newToken);
                handleRenewed(storageKey, newToken, existingToken);
            }
            else if (newToken) {
                handleAdded(storageKey, newToken);
            }
            else if (existingToken) {
                handleRemoved(storageKey, existingToken);
            }
        });
    }
    remove(key) {
        this.clearExpireEventTimeout(key);
        var tokenStorage = this.storage.getStorage();
        var removedToken = tokenStorage[key];
        delete tokenStorage[key];
        this.storage.setStorage(tokenStorage);
        this.emitSetStorageEvent();
        this.emitRemoved(key, removedToken);
    }
    async renewToken(token) {
        var _a;
        return (_a = this.sdk.token) === null || _a === void 0 ? void 0 : _a.renew(token);
    }
    validateToken(token) {
        return validateToken(token);
    }
    renew(key) {
        if (this.state.renewPromise) {
            return this.state.renewPromise;
        }
        try {
            var token = this.getSync(key);
            if (!token) {
                throw new AuthSdkError('The tokenManager has no token for the key: ' + key);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
        this.clearExpireEventTimeout(key);
        const renewPromise = this.state.renewPromise = this.sdk.token.renewTokens()
            .then(tokens => {
            this.setTokens(tokens);
            const tokenType = this.getTokenType(token);
            return tokens[tokenType];
        })
            .catch(err => {
            this.remove(key);
            err.tokenKey = key;
            this.emitError(err);
            throw err;
        })
            .finally(() => {
            this.state.renewPromise = null;
        });
        return renewPromise;
    }
    clear() {
        const tokens = this.getTokensSync();
        this.clearExpireEventTimeoutAll();
        this.storage.clearStorage();
        this.emitSetStorageEvent();
        Object.keys(tokens).forEach(key => {
            this.emitRemoved(key, tokens[key]);
        });
    }
    clearPendingRemoveTokens() {
        const tokenStorage = this.storage.getStorage();
        const removedTokens = {};
        Object.keys(tokenStorage).forEach(key => {
            if (tokenStorage[key].pendingRemove) {
                removedTokens[key] = tokenStorage[key];
                delete tokenStorage[key];
            }
        });
        this.storage.setStorage(tokenStorage);
        this.emitSetStorageEvent();
        Object.keys(removedTokens).forEach(key => {
            this.clearExpireEventTimeout(key);
            this.emitRemoved(key, removedTokens[key]);
        });
    }
    updateRefreshToken(token) {
        const key = this.getStorageKeyByType('refreshToken') || REFRESH_TOKEN_STORAGE_KEY;
        var tokenStorage = this.storage.getStorage();
        validateToken(token);
        tokenStorage[key] = token;
        this.storage.setStorage(tokenStorage);
        this.emitSetStorageEvent();
    }
    removeRefreshToken() {
        const key = this.getStorageKeyByType('refreshToken') || REFRESH_TOKEN_STORAGE_KEY;
        this.remove(key);
    }
    addPendingRemoveFlags() {
        const tokens = this.getTokensSync();
        Object.keys(tokens).forEach(key => {
            tokens[key].pendingRemove = true;
        });
        this.setTokens(tokens);
    }
}

export { TokenManager };
//# sourceMappingURL=TokenManager.js.map
