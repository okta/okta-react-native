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

import { getOAuthUrls } from './oauth.js';

function createOAuthMeta(sdk, tokenParams) {
    const issuer = sdk.options.issuer;
    const urls = getOAuthUrls(sdk, tokenParams);
    const oauthMeta = {
        issuer,
        urls,
        clientId: tokenParams.clientId,
        redirectUri: tokenParams.redirectUri,
        responseType: tokenParams.responseType,
        responseMode: tokenParams.responseMode,
        scopes: tokenParams.scopes,
        state: tokenParams.state,
        nonce: tokenParams.nonce,
        ignoreSignature: tokenParams.ignoreSignature,
        acrValues: tokenParams.acrValues,
    };
    if (tokenParams.pkce === false) {
        return oauthMeta;
    }
    const pkceMeta = Object.assign(Object.assign({}, oauthMeta), { codeVerifier: tokenParams.codeVerifier, codeChallengeMethod: tokenParams.codeChallengeMethod, codeChallenge: tokenParams.codeChallenge });
    return pkceMeta;
}

export { createOAuthMeta };
//# sourceMappingURL=oauthMeta.js.map
