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
import { isRefreshToken } from '../oidc/types/Token.js';
import { EVENT_EXPIRED } from '../oidc/types/TokenManager.js';
import { isBrowser } from '../features.js';

class AutoRenewService {
    constructor(tokenManager, options = {}) {
        this.started = false;
        this.tokenManager = tokenManager;
        this.options = options;
        this.renewTimeQueue = [];
        this.onTokenExpiredHandler = this.onTokenExpiredHandler.bind(this);
    }
    shouldThrottleRenew() {
        let res = false;
        this.renewTimeQueue.push(Date.now());
        if (this.renewTimeQueue.length >= 10) {
            const firstTime = this.renewTimeQueue.shift();
            const lastTime = this.renewTimeQueue[this.renewTimeQueue.length - 1];
            res = (lastTime - firstTime) < 30 * 1000;
        }
        return res;
    }
    requiresLeadership() {
        return !!this.options.syncStorage && isBrowser();
    }
    processExpiredTokens() {
        const tokenStorage = this.tokenManager.getStorage();
        const tokens = tokenStorage.getStorage();
        Object.keys(tokens).forEach(key => {
            const token = tokens[key];
            if (!isRefreshToken(token) && this.tokenManager.hasExpired(token)) {
                this.onTokenExpiredHandler(key);
            }
        });
    }
    onTokenExpiredHandler(key) {
        if (this.options.autoRenew) {
            if (this.shouldThrottleRenew()) {
                const error = new AuthSdkError('Too many token renew requests');
                this.tokenManager.emitError(error);
            }
            else {
                this.tokenManager.renew(key).catch(() => { });
            }
        }
        else if (this.options.autoRemove) {
            this.tokenManager.remove(key);
        }
    }
    canStart() {
        return (!!this.options.autoRenew || !!this.options.autoRemove) && !this.started;
    }
    async start() {
        if (this.canStart()) {
            this.tokenManager.on(EVENT_EXPIRED, this.onTokenExpiredHandler);
            if (this.tokenManager.isStarted()) {
                this.processExpiredTokens();
            }
            this.started = true;
        }
    }
    async stop() {
        if (this.started) {
            this.tokenManager.off(EVENT_EXPIRED, this.onTokenExpiredHandler);
            this.renewTimeQueue = [];
            this.started = false;
        }
    }
    isStarted() {
        return this.started;
    }
}

export { AutoRenewService };
//# sourceMappingURL=AutoRenewService.js.map
