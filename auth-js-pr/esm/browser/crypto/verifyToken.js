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
import { stringToBuffer, base64UrlDecode } from './base64.js';
import { webcrypto as c } from './browser.js';

function verifyToken(idToken, key) {
    key = clone(key);
    var format = 'jwk';
    var algo = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' }
    };
    var extractable = true;
    var usages = ['verify'];
    delete key.use;
    return c.subtle.importKey(format, key, algo, extractable, usages)
        .then(function (cryptoKey) {
        var jwt = idToken.split('.');
        var payload = stringToBuffer(jwt[0] + '.' + jwt[1]);
        var b64Signature = base64UrlDecode(jwt[2]);
        var signature = stringToBuffer(b64Signature);
        return c.subtle.verify(algo, cryptoKey, signature, payload);
    });
}

export { verifyToken };
//# sourceMappingURL=verifyToken.js.map
