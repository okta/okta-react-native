"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.AutoRenewService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _errors = require("../errors");
var _types = require("../oidc/types");
var _features = require("../features");
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

class AutoRenewService {
  constructor(tokenManager, options = {}) {
    (0, _defineProperty2.default)(this, "started", false);
    this.tokenManager = tokenManager;
    this.options = options;
    this.renewTimeQueue = [];
    this.onTokenExpiredHandler = this.onTokenExpiredHandler.bind(this);
  }
  shouldThrottleRenew() {
    let res = false;
    this.renewTimeQueue.push(Date.now());
    if (this.renewTimeQueue.length >= 10) {
      // get and remove first item from queue
      const firstTime = this.renewTimeQueue.shift();
      const lastTime = this.renewTimeQueue[this.renewTimeQueue.length - 1];
      res = lastTime - firstTime < 30 * 1000;
    }
    return res;
  }
  requiresLeadership() {
    // If tokens sync storage is enabled, handle tokens expiration only in 1 leader tab
    return !!this.options.syncStorage && (0, _features.isBrowser)();
  }
  processExpiredTokens() {
    const tokenStorage = this.tokenManager.getStorage();
    const tokens = tokenStorage.getStorage();
    Object.keys(tokens).forEach(key => {
      const token = tokens[key];
      if (!(0, _types.isRefreshToken)(token) && this.tokenManager.hasExpired(token)) {
        this.onTokenExpiredHandler(key);
      }
    });
  }
  onTokenExpiredHandler(key) {
    if (this.options.autoRenew) {
      if (this.shouldThrottleRenew()) {
        const error = new _errors.AuthSdkError('Too many token renew requests');
        this.tokenManager.emitError(error);
      } else {
        this.tokenManager.renew(key).catch(() => {}); // Renew errors will emit an "error" event 
      }
    } else if (this.options.autoRemove) {
      this.tokenManager.remove(key);
    }
  }
  canStart() {
    return (!!this.options.autoRenew || !!this.options.autoRemove) && !this.started;
  }
  async start() {
    if (this.canStart()) {
      this.tokenManager.on(_types.EVENT_EXPIRED, this.onTokenExpiredHandler);
      if (this.tokenManager.isStarted()) {
        // If token manager has been already started, we could miss token expire events,
        //  so need to process expired tokens manually.
        this.processExpiredTokens();
      }
      this.started = true;
    }
  }
  async stop() {
    if (this.started) {
      this.tokenManager.off(_types.EVENT_EXPIRED, this.onTokenExpiredHandler);
      this.renewTimeQueue = [];
      this.started = false;
    }
  }
  isStarted() {
    return this.started;
  }
}
exports.AutoRenewService = AutoRenewService;
//# sourceMappingURL=AutoRenewService.js.map