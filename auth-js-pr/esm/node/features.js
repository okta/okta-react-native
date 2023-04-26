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

import { webcrypto } from './crypto/node.js';

const isWindowsPhone = /windows phone|iemobile|wpdesktop/i;
function isBrowser() {
    return typeof document !== 'undefined' && typeof window !== 'undefined';
}
function isIE11OrLess() {
    if (!isBrowser()) {
        return false;
    }
    const documentMode = document.documentMode;
    return !!documentMode && documentMode <= 11;
}
function getUserAgent() {
    return navigator.userAgent;
}
function isFingerprintSupported() {
    const agent = getUserAgent();
    return agent && !isWindowsPhone.test(agent);
}
function isPopupPostMessageSupported() {
    if (!isBrowser()) {
        return false;
    }
    const documentMode = document.documentMode;
    var isIE8or9 = documentMode && documentMode < 10;
    if (typeof window.postMessage !== 'undefined' && !isIE8or9) {
        return true;
    }
    return false;
}
function isTokenVerifySupported() {
    return typeof webcrypto !== 'undefined'
        && webcrypto !== null
        && typeof webcrypto.subtle !== 'undefined'
        && typeof Uint8Array !== 'undefined';
}
function hasTextEncoder() {
    return typeof TextEncoder !== 'undefined';
}
function isPKCESupported() {
    return isTokenVerifySupported() && hasTextEncoder();
}
function isHTTPS() {
    if (!isBrowser()) {
        return false;
    }
    return window.location.protocol === 'https:';
}
function isLocalhost() {
    return isBrowser() && window.location.hostname === 'localhost';
}

export { getUserAgent, hasTextEncoder, isBrowser, isFingerprintSupported, isHTTPS, isIE11OrLess, isLocalhost, isPKCESupported, isPopupPostMessageSupported, isTokenVerifySupported };
//# sourceMappingURL=features.js.map
