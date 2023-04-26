"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.TokenManager = void 0;
var _util = require("../util");
var _errors = require("../errors");
var _util2 = require("../oidc/util");
var _features = require("../features");
var _clock = _interopRequireDefault(require("../clock"));
var _types = require("./types");
var _constants = require("../constants");
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
 *
 */

const DEFAULT_OPTIONS = {
  // TODO: remove in next major version - OKTA-473815
  autoRenew: true,
  autoRemove: true,
  syncStorage: true,
  // --- //
  clearPendingRemoveTokens: true,
  storage: undefined,
  // will use value from storageManager config
  expireEarlySeconds: 30,
  storageKey: _constants.TOKEN_STORAGE_NAME
};
function defaultState() {
  return {
    expireTimeouts: {},
    renewPromise: null
  };
}
class TokenManager {
  on(event, handler, context) {
    if (context) {
      this.emitter.on(event, handler, context);
    } else {
      this.emitter.on(event, handler);
    }
  }
  off(event, handler) {
    if (handler) {
      this.emitter.off(event, handler);
    } else {
      this.emitter.off(event);
    }
  }

  // eslint-disable-next-line complexity
  constructor(sdk, options = {}) {
    this.sdk = sdk;
    this.emitter = sdk.emitter;
    if (!this.emitter) {
      throw new _errors.AuthSdkError('Emitter should be initialized before TokenManager');
    }
    options = Object.assign({}, DEFAULT_OPTIONS, (0, _util.removeNils)(options));
    if (!(0, _features.isLocalhost)()) {
      options.expireEarlySeconds = DEFAULT_OPTIONS.expireEarlySeconds;
    }
    this.options = options;
    const storageOptions = (0, _util.removeNils)({
      storageKey: options.storageKey,
      secure: options.secure
    });
    if (typeof options.storage === 'object') {
      // A custom storage provider must implement getItem(key) and setItem(key, val)
      storageOptions.storageProvider = options.storage;
    } else if (options.storage) {
      storageOptions.storageType = options.storage;
    }
    this.storage = sdk.storageManager.getTokenStorage({
      ...storageOptions,
      useSeparateCookies: true
    });
    this.clock = _clock.default.create();
    this.state = defaultState();
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
    return (0, _util.clone)(this.options);
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
    this.emitter.emit(_types.EVENT_EXPIRED, key, token);
  }
  emitRenewed(key, freshToken, oldToken) {
    this.emitter.emit(_types.EVENT_RENEWED, key, freshToken, oldToken);
  }
  emitAdded(key, token) {
    this.emitter.emit(_types.EVENT_ADDED, key, token);
  }
  emitRemoved(key, token) {
    this.emitter.emit(_types.EVENT_REMOVED, key, token);
  }
  emitError(error) {
    this.emitter.emit(_types.EVENT_ERROR, error);
  }
  clearExpireEventTimeout(key) {
    clearTimeout(this.state.expireTimeouts[key]);
    delete this.state.expireTimeouts[key];

    // Remove the renew promise (if it exists)
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
    if ((0, _types.isRefreshToken)(token)) {
      return;
    }
    var expireTime = this.getExpireTime(token);
    var expireEventWait = Math.max(expireTime - this.clock.now(), 0) * 1000;

    // Clear any existing timeout
    this.clearExpireEventTimeout(key);
    var expireEventTimeout = setTimeout(() => {
      this.emitExpired(key, token);
    }, expireEventWait);

    // Add a new timeout
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

  // reset timeouts to setup autoRenew for tokens from other document context (tabs)
  resetExpireEventTimeoutAll() {
    this.clearExpireEventTimeoutAll();
    this.setExpireEventTimeoutAll();
  }
  add(key, token) {
    var tokenStorage = this.storage.getStorage();
    (0, _util2.validateToken)(token);
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
      if ((0, _types.isAccessToken)(token)) {
        tokens.accessToken = token;
      } else if ((0, _types.isIDToken)(token)) {
        tokens.idToken = token;
      } else if ((0, _types.isRefreshToken)(token)) {
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
      return (0, _types.isAccessToken)(token) && type === 'accessToken' || (0, _types.isIDToken)(token) && type === 'idToken' || (0, _types.isRefreshToken)(token) && type === 'refreshToken';
    })[0];
    return key;
  }
  getTokenType(token) {
    if ((0, _types.isAccessToken)(token)) {
      return 'accessToken';
    }
    if ((0, _types.isIDToken)(token)) {
      return 'idToken';
    }
    if ((0, _types.isRefreshToken)(token)) {
      return 'refreshToken';
    }
    throw new _errors.AuthSdkError('Unknown token type');
  }

  // for synchronization of LocalStorage cross tabs for IE11
  emitSetStorageEvent() {
    if ((0, _features.isIE11OrLess)()) {
      const storage = this.storage.getStorage();
      this.emitter.emit(_types.EVENT_SET_STORAGE, storage);
    }
  }

  // used in `SyncStorageService` for synchronization of LocalStorage cross tabs for IE11
  getStorage() {
    return this.storage;
  }
  setTokens(tokens,
  // TODO: callbacks can be removed in the next major version OKTA-407224
  accessTokenCb, idTokenCb, refreshTokenCb) {
    const handleTokenCallback = (key, token) => {
      const type = this.getTokenType(token);
      if (type === 'accessToken') {
        accessTokenCb && accessTokenCb(key, token);
      } else if (type === 'idToken') {
        idTokenCb && idTokenCb(key, token);
      } else if (type === 'refreshToken') {
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

    // valid tokens
    types.forEach(type => {
      const token = tokens[type];
      if (token) {
        (0, _util2.validateToken)(token, type);
      }
    });

    // add token to storage
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

    // emit event and start expiration timer
    types.forEach(type => {
      const newToken = tokens[type];
      const existingToken = existingTokens[type];
      const storageKey = this.getStorageKeyByType(type) || type;
      if (newToken && existingToken) {
        // renew
        // call handleRemoved first, since it clears timers
        handleRemoved(storageKey, existingToken);
        handleAdded(storageKey, newToken);
        handleRenewed(storageKey, newToken, existingToken);
      } else if (newToken) {
        // add
        handleAdded(storageKey, newToken);
      } else if (existingToken) {
        //remove
        handleRemoved(storageKey, existingToken);
      }
    });
  }
  remove(key) {
    // Clear any listener for this token
    this.clearExpireEventTimeout(key);
    var tokenStorage = this.storage.getStorage();
    var removedToken = tokenStorage[key];
    delete tokenStorage[key];
    this.storage.setStorage(tokenStorage);
    this.emitSetStorageEvent();
    this.emitRemoved(key, removedToken);
  }

  // TODO: this methods is redundant and can be removed in the next major version OKTA-407224
  async renewToken(token) {
    var _this$sdk$token;
    return (_this$sdk$token = this.sdk.token) === null || _this$sdk$token === void 0 ? void 0 : _this$sdk$token.renew(token);
  }
  // TODO: this methods is redundant and can be removed in the next major version OKTA-407224
  validateToken(token) {
    return (0, _util2.validateToken)(token);
  }

  // TODO: renew method should take no param, change in the next major version OKTA-407224
  renew(key) {
    // Multiple callers may receive the same promise. They will all resolve or reject from the same request.
    if (this.state.renewPromise) {
      return this.state.renewPromise;
    }
    try {
      var token = this.getSync(key);
      if (!token) {
        throw new _errors.AuthSdkError('The tokenManager has no token for the key: ' + key);
      }
    } catch (e) {
      return Promise.reject(e);
    }

    // Remove existing autoRenew timeout
    this.clearExpireEventTimeout(key);

    // A refresh token means a replace instead of renewal
    // Store the renew promise state, to avoid renewing again
    const renewPromise = this.state.renewPromise = this.sdk.token.renewTokens().then(tokens => {
      this.setTokens(tokens);

      // resolve token based on the key
      const tokenType = this.getTokenType(token);
      return tokens[tokenType];
    }).catch(err => {
      // If renew fails, remove token from storage and emit error
      this.remove(key);
      err.tokenKey = key;
      this.emitError(err);
      throw err;
    }).finally(() => {
      // Remove existing promise key
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
    const key = this.getStorageKeyByType('refreshToken') || _constants.REFRESH_TOKEN_STORAGE_KEY;

    // do not emit any event
    var tokenStorage = this.storage.getStorage();
    (0, _util2.validateToken)(token);
    tokenStorage[key] = token;
    this.storage.setStorage(tokenStorage);
    this.emitSetStorageEvent();
  }
  removeRefreshToken() {
    const key = this.getStorageKeyByType('refreshToken') || _constants.REFRESH_TOKEN_STORAGE_KEY;
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
exports.TokenManager = TokenManager;
//# sourceMappingURL=TokenManager.js.map