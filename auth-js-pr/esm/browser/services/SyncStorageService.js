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

import { BroadcastChannel } from 'broadcast-channel';
import { isBrowser } from '../features.js';
import { EVENT_ADDED, EVENT_REMOVED, EVENT_RENEWED, EVENT_SET_STORAGE } from '../oidc/types/TokenManager.js';
import AuthSdkError from '../errors/AuthSdkError.js';

class SyncStorageService {
    constructor(tokenManager, options = {}) {
        this.started = false;
        this.enablePostMessage = true;
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
        return !!this.options.syncStorage && isBrowser() && !this.started;
    }
    async start() {
        if (!this.canStart()) {
            return;
        }
        const { syncChannelName } = this.options;
        try {
            this.channel = new BroadcastChannel(syncChannelName);
        }
        catch (err) {
            throw new AuthSdkError('SyncStorageService is not supported in current browser.');
        }
        this.tokenManager.on(EVENT_ADDED, this.onTokenAddedHandler);
        this.tokenManager.on(EVENT_REMOVED, this.onTokenRemovedHandler);
        this.tokenManager.on(EVENT_RENEWED, this.onTokenRenewedHandler);
        this.tokenManager.on(EVENT_SET_STORAGE, this.onSetStorageHandler);
        this.channel.addEventListener('message', this.onSyncMessageHandler);
        this.started = true;
    }
    async stop() {
        var _a, _b;
        if (this.started) {
            this.tokenManager.off(EVENT_ADDED, this.onTokenAddedHandler);
            this.tokenManager.off(EVENT_REMOVED, this.onTokenRemovedHandler);
            this.tokenManager.off(EVENT_RENEWED, this.onTokenRenewedHandler);
            this.tokenManager.off(EVENT_SET_STORAGE, this.onSetStorageHandler);
            (_a = this.channel) === null || _a === void 0 ? void 0 : _a.removeEventListener('message', this.onSyncMessageHandler);
            await ((_b = this.channel) === null || _b === void 0 ? void 0 : _b.close());
            this.channel = undefined;
            this.started = false;
        }
    }
    onTokenAddedHandler(key, token) {
        var _a;
        if (!this.enablePostMessage) {
            return;
        }
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: EVENT_ADDED,
            key,
            token
        });
    }
    onTokenRemovedHandler(key, token) {
        var _a;
        if (!this.enablePostMessage) {
            return;
        }
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: EVENT_REMOVED,
            key,
            token
        });
    }
    onTokenRenewedHandler(key, token, oldToken) {
        var _a;
        if (!this.enablePostMessage) {
            return;
        }
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: EVENT_RENEWED,
            key,
            token,
            oldToken
        });
    }
    onSetStorageHandler(storage) {
        var _a;
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: EVENT_SET_STORAGE,
            storage
        });
    }
    onSyncMessageHandler(msg) {
        this.enablePostMessage = false;
        switch (msg.type) {
            case EVENT_SET_STORAGE:
                this.tokenManager.getStorage().setStorage(msg.storage);
                break;
            case EVENT_ADDED:
                this.tokenManager.emitAdded(msg.key, msg.token);
                this.tokenManager.setExpireEventTimeout(msg.key, msg.token);
                break;
            case EVENT_REMOVED:
                this.tokenManager.clearExpireEventTimeout(msg.key);
                this.tokenManager.emitRemoved(msg.key, msg.token);
                break;
            case EVENT_RENEWED:
                this.tokenManager.emitRenewed(msg.key, msg.token, msg.oldToken);
                break;
        }
        this.enablePostMessage = true;
    }
}

export { SyncStorageService };
//# sourceMappingURL=SyncStorageService.js.map
