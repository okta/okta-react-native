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

import { clone } from '../util/object.js';
import fingerprint from '../browser/fingerprint.js';
import { createAuthnTransactionAPI } from './factory.js';

function mixinAuthn(Base) {
    return class OktaAuthTx extends Base {
        constructor(...args) {
            super(...args);
            this.authn = this.tx = createAuthnTransactionAPI(this);
            this.fingerprint = fingerprint.bind(null, this);
        }
        async signIn(opts) {
            opts = clone(opts || {});
            const _postToTransaction = (options) => {
                delete opts.sendFingerprint;
                return this.tx.postToTransaction('/api/v1/authn', opts, options);
            };
            if (!opts.sendFingerprint) {
                return _postToTransaction();
            }
            return this.fingerprint()
                .then(function (fingerprint) {
                return _postToTransaction({
                    headers: {
                        'X-Device-Fingerprint': fingerprint
                    }
                });
            });
        }
        async signInWithCredentials(opts) {
            return this.signIn(opts);
        }
        forgotPassword(opts) {
            return this.tx.postToTransaction('/api/v1/authn/recovery/password', opts);
        }
        unlockAccount(opts) {
            return this.tx.postToTransaction('/api/v1/authn/recovery/unlock', opts);
        }
        verifyRecoveryToken(opts) {
            return this.tx.postToTransaction('/api/v1/authn/recovery/token', opts);
        }
    };
}

export { mixinAuthn };
//# sourceMappingURL=mixin.js.map
