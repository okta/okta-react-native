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

import AuthSdkError from '../../errors/AuthSdkError.js';
import '../../crypto/node.js';
import { find } from '../../util/object.js';
import { get } from '../../http/request.js';
import 'tiny-emitter';
import '../../server/serverStorage.js';
import 'cross-fetch';

function getWellKnown(sdk, issuer) {
    var authServerUri = (issuer || sdk.options.issuer);
    return get(sdk, authServerUri + '/.well-known/openid-configuration', {
        cacheResponse: true
    });
}
function getKey(sdk, issuer, kid) {
    var httpCache = sdk.storageManager.getHttpCache(sdk.options.cookies);
    return getWellKnown(sdk, issuer)
        .then(function (wellKnown) {
        var jwksUri = wellKnown['jwks_uri'];
        var cacheContents = httpCache.getStorage();
        var cachedResponse = cacheContents[jwksUri];
        if (cachedResponse && Date.now() / 1000 < cachedResponse.expiresAt) {
            var cachedKey = find(cachedResponse.response.keys, {
                kid: kid
            });
            if (cachedKey) {
                return cachedKey;
            }
        }
        httpCache.clearStorage(jwksUri);
        return get(sdk, jwksUri, {
            cacheResponse: true
        })
            .then(function (res) {
            var key = find(res.keys, {
                kid: kid
            });
            if (key) {
                return key;
            }
            throw new AuthSdkError('The key id, ' + kid + ', was not found in the server\'s keys');
        });
    });
}

export { getKey, getWellKnown };
//# sourceMappingURL=well-known.js.map
