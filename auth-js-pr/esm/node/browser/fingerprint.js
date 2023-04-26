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
import { isFingerprintSupported } from '../features.js';
import '../crypto/node.js';
import { addListener, removeListener } from '../oidc/util/browser.js';
import 'tiny-emitter';
import '../server/serverStorage.js';
import 'cross-fetch';

function fingerprint(sdk, options) {
    options = options || {};
    if (!isFingerprintSupported()) {
        return Promise.reject(new AuthSdkError('Fingerprinting is not supported on this device'));
    }
    var timeout;
    var iframe;
    var listener;
    var promise = new Promise(function (resolve, reject) {
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        listener = function listener(e) {
            if (!e || !e.data || e.origin !== sdk.getIssuerOrigin()) {
                return;
            }
            try {
                var msg = JSON.parse(e.data);
            }
            catch (err) {
                return;
            }
            if (!msg) {
                return;
            }
            if (msg.type === 'FingerprintAvailable') {
                return resolve(msg.fingerprint);
            }
            if (msg.type === 'FingerprintServiceReady') {
                e.source.postMessage(JSON.stringify({
                    type: 'GetFingerprint'
                }), e.origin);
            }
        };
        addListener(window, 'message', listener);
        iframe.src = sdk.getIssuerOrigin() + '/auth/services/devicefingerprint';
        document.body.appendChild(iframe);
        timeout = setTimeout(function () {
            reject(new AuthSdkError('Fingerprinting timed out'));
        }, (options === null || options === void 0 ? void 0 : options.timeout) || 15000);
    });
    return promise.finally(function () {
        clearTimeout(timeout);
        removeListener(window, 'message', listener);
        if (document.body.contains(iframe)) {
            iframe.parentElement.removeChild(iframe);
        }
    });
}

export { fingerprint as default };
//# sourceMappingURL=fingerprint.js.map
