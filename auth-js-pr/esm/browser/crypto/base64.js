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
import { btoa as b, atob as a } from './browser.js';

function stringToBase64Url(str) {
    var b64 = b(str);
    return base64ToBase64Url(b64);
}
function base64ToBase64Url(b64) {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64UrlToBase64(b64u) {
    return b64u.replace(/-/g, '+').replace(/_/g, '/');
}
function base64UrlToString(b64u) {
    var b64 = base64UrlToBase64(b64u);
    switch (b64.length % 4) {
        case 0:
            break;
        case 2:
            b64 += '==';
            break;
        case 3:
            b64 += '=';
            break;
        default:
            throw new AuthSdkError('Not a valid Base64Url');
    }
    var utf8 = a(b64);
    try {
        return decodeURIComponent(escape(utf8));
    }
    catch (e) {
        return utf8;
    }
}
function stringToBuffer(str) {
    var buffer = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        buffer[i] = str.charCodeAt(i);
    }
    return buffer;
}
function base64UrlDecode(str) {
    return a(base64UrlToBase64(str));
}
function base64UrlToBuffer(b64u) {
    return Uint8Array.from(base64UrlDecode(b64u), (c) => c.charCodeAt(0));
}
function bufferToBase64Url(bin) {
    return b(new Uint8Array(bin).reduce((s, byte) => s + String.fromCharCode(byte), ''));
}

export { base64ToBase64Url, base64UrlDecode, base64UrlToBase64, base64UrlToBuffer, base64UrlToString, bufferToBase64Url, stringToBase64Url, stringToBuffer };
//# sourceMappingURL=base64.js.map
