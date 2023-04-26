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

import { getSavedTransactionMeta, createTransactionMeta, saveTransactionMeta } from './transactionMeta.js';
import { removeNils } from '../util/object.js';
import { getOAuthBaseUrl } from '../oidc/util/oauth.js';
import { httpRequest } from '../http/request.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';

function getResponse(meta) {
    return {
        meta,
        interactionHandle: meta.interactionHandle,
        state: meta.state
    };
}
async function interact(authClient, options = {}) {
    options = removeNils(options);
    let meta = getSavedTransactionMeta(authClient, options);
    if (meta === null || meta === void 0 ? void 0 : meta.interactionHandle) {
        return getResponse(meta);
    }
    meta = await createTransactionMeta(authClient, Object.assign(Object.assign({}, meta), options));
    const baseUrl = getOAuthBaseUrl(authClient);
    let { clientId, redirectUri, state, scopes, withCredentials, codeChallenge, codeChallengeMethod, activationToken, recoveryToken, maxAge, acrValues, nonce } = meta;
    const clientSecret = options.clientSecret || authClient.options.clientSecret;
    withCredentials = withCredentials !== null && withCredentials !== void 0 ? withCredentials : true;
    const url = `${baseUrl}/v1/interact`;
    const params = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ client_id: clientId, scope: scopes.join(' '), redirect_uri: redirectUri, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod, state }, (activationToken && { activation_token: activationToken })), (recoveryToken && { recovery_token: recoveryToken })), (clientSecret && { client_secret: clientSecret })), (maxAge && { max_age: maxAge })), (acrValues && { acr_values: acrValues })), (nonce && { nonce }));
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const resp = await httpRequest(authClient, {
        method: 'POST',
        url,
        headers,
        withCredentials,
        args: params
    });
    const interactionHandle = resp.interaction_handle;
    const newMeta = Object.assign(Object.assign({}, meta), { interactionHandle,
        withCredentials,
        state,
        scopes,
        recoveryToken,
        activationToken });
    saveTransactionMeta(authClient, newMeta);
    return getResponse(newMeta);
}

export { interact };
//# sourceMappingURL=interact.js.map
