"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.mixinAuthn = mixinAuthn;
var _util = require("../util");
var _fingerprint = _interopRequireDefault(require("../browser/fingerprint"));
var _factory = require("./factory");
/* eslint-disable max-statements */
/* eslint-disable complexity */
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

function mixinAuthn(Base) {
  return class OktaAuthTx extends Base {
    // legacy, may be removed in future version

    constructor(...args) {
      super(...args);
      this.authn = this.tx = (0, _factory.createAuthnTransactionAPI)(this);

      // Fingerprint API
      this.fingerprint = _fingerprint.default.bind(null, this);
    }

    // Authn  V1
    async signIn(opts) {
      opts = (0, _util.clone)(opts || {});
      const _postToTransaction = options => {
        delete opts.sendFingerprint;
        return this.tx.postToTransaction('/api/v1/authn', opts, options);
      };
      if (!opts.sendFingerprint) {
        return _postToTransaction();
      }
      return this.fingerprint().then(function (fingerprint) {
        return _postToTransaction({
          headers: {
            'X-Device-Fingerprint': fingerprint
          }
        });
      });
    }

    // Authn  V1
    async signInWithCredentials(opts) {
      return this.signIn(opts);
    }

    // { username, (relayState) }
    forgotPassword(opts) {
      return this.tx.postToTransaction('/api/v1/authn/recovery/password', opts);
    }

    // { username, (relayState) }
    unlockAccount(opts) {
      return this.tx.postToTransaction('/api/v1/authn/recovery/unlock', opts);
    }

    // { recoveryToken }
    verifyRecoveryToken(opts) {
      return this.tx.postToTransaction('/api/v1/authn/recovery/token', opts);
    }
  };
}
//# sourceMappingURL=mixin.js.map