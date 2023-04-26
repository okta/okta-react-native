"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.SyncStorageService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _broadcastChannel = require("broadcast-channel");
var _features = require("../features");
var _types = require("../oidc/types");
var _errors = require("../errors");
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

class SyncStorageService {
  constructor(tokenManager, options = {}) {
    (0, _defineProperty2.default)(this, "started", false);
    (0, _defineProperty2.default)(this, "enablePostMessage", true);
    this.tokenManager = tokenManager;
    this.options = options;
    this.onTokenAddedHandler = this.onTokenAddedHandler.bind(this);
    this.onTokenRemovedHandler = this.onTokenRemovedHandler.bind(this);
    this.onTokenRenewedHandler = this.onTokenRenewedHandler.bind(this);
    this.onSetStorageHandler = this.onSetStorageHandler.bind(this);
    this.onSyncMessageHandler = this.onSyncMessageHandler.bind(this);
  }
  requiresLeadership() {
    return false;
  }
  isStarted() {
    return this.started;
  }
  canStart() {
    return !!this.options.syncStorage && (0, _features.isBrowser)() && !this.started;
  }
  async start() {
    if (!this.canStart()) {
      return;
    }
    const {
      syncChannelName
    } = this.options;
    try {
      // BroadcastChannel throws if no supported method can be found
      this.channel = new _broadcastChannel.BroadcastChannel(syncChannelName);
    } catch (err) {
      throw new _errors.AuthSdkError('SyncStorageService is not supported in current browser.');
    }
    this.tokenManager.on(_types.EVENT_ADDED, this.onTokenAddedHandler);
    this.tokenManager.on(_types.EVENT_REMOVED, this.onTokenRemovedHandler);
    this.tokenManager.on(_types.EVENT_RENEWED, this.onTokenRenewedHandler);
    this.tokenManager.on(_types.EVENT_SET_STORAGE, this.onSetStorageHandler);
    this.channel.addEventListener('message', this.onSyncMessageHandler);
    this.started = true;
  }
  async stop() {
    if (this.started) {
      var _this$channel, _this$channel2;
      this.tokenManager.off(_types.EVENT_ADDED, this.onTokenAddedHandler);
      this.tokenManager.off(_types.EVENT_REMOVED, this.onTokenRemovedHandler);
      this.tokenManager.off(_types.EVENT_RENEWED, this.onTokenRenewedHandler);
      this.tokenManager.off(_types.EVENT_SET_STORAGE, this.onSetStorageHandler);
      (_this$channel = this.channel) === null || _this$channel === void 0 ? void 0 : _this$channel.removeEventListener('message', this.onSyncMessageHandler);
      await ((_this$channel2 = this.channel) === null || _this$channel2 === void 0 ? void 0 : _this$channel2.close());
      this.channel = undefined;
      this.started = false;
    }
  }
  onTokenAddedHandler(key, token) {
    var _this$channel3;
    if (!this.enablePostMessage) {
      return;
    }
    (_this$channel3 = this.channel) === null || _this$channel3 === void 0 ? void 0 : _this$channel3.postMessage({
      type: _types.EVENT_ADDED,
      key,
      token
    });
  }
  onTokenRemovedHandler(key, token) {
    var _this$channel4;
    if (!this.enablePostMessage) {
      return;
    }
    (_this$channel4 = this.channel) === null || _this$channel4 === void 0 ? void 0 : _this$channel4.postMessage({
      type: _types.EVENT_REMOVED,
      key,
      token
    });
  }
  onTokenRenewedHandler(key, token, oldToken) {
    var _this$channel5;
    if (!this.enablePostMessage) {
      return;
    }
    (_this$channel5 = this.channel) === null || _this$channel5 === void 0 ? void 0 : _this$channel5.postMessage({
      type: _types.EVENT_RENEWED,
      key,
      token,
      oldToken
    });
  }
  onSetStorageHandler(storage) {
    var _this$channel6;
    (_this$channel6 = this.channel) === null || _this$channel6 === void 0 ? void 0 : _this$channel6.postMessage({
      type: _types.EVENT_SET_STORAGE,
      storage
    });
  }

  /* eslint-disable complexity */
  onSyncMessageHandler(msg) {
    // Notes:
    // 1. Using `enablePostMessage` flag here to prevent sync message loop.
    //    If this flag is on, tokenManager event handlers do not post sync message.
    // 2. IE11 has known issue with synchronization of LocalStorage cross tabs.
    //    One workaround is to set empty event handler for `window.onstorage`.
    //    But it's not 100% working, sometimes you still get old value from LocalStorage.
    //    Better approch is to explicitly udpate LocalStorage with `setStorage`.

    this.enablePostMessage = false;
    switch (msg.type) {
      case _types.EVENT_SET_STORAGE:
        this.tokenManager.getStorage().setStorage(msg.storage);
        break;
      case _types.EVENT_ADDED:
        this.tokenManager.emitAdded(msg.key, msg.token);
        this.tokenManager.setExpireEventTimeout(msg.key, msg.token);
        break;
      case _types.EVENT_REMOVED:
        this.tokenManager.clearExpireEventTimeout(msg.key);
        this.tokenManager.emitRemoved(msg.key, msg.token);
        break;
      case _types.EVENT_RENEWED:
        this.tokenManager.emitRenewed(msg.key, msg.token, msg.oldToken);
        break;
      default:
        break;
    }
    this.enablePostMessage = true;
  }
}
exports.SyncStorageService = SyncStorageService;
//# sourceMappingURL=SyncStorageService.js.map