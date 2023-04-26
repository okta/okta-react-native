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

import { getDefaultTokenParams } from './util/defaultTokenParams.js';
import { getOAuthUrls } from './util/oauth.js';
import { clone } from '../util/object.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';
import { postToTokenEndpoint } from './endpoints/token.js';
import { handleOAuthResponse } from './handleOAuthResponse.js';

function exchangeCodeForTokens(sdk, tokenParams, urls) {
    urls = urls || getOAuthUrls(sdk, tokenParams);
    tokenParams = Object.assign({}, getDefaultTokenParams(sdk), clone(tokenParams));
    const { authorizationCode, interactionCode, codeVerifier, clientId, redirectUri, scopes, ignoreSignature, state, acrValues } = tokenParams;
    var getTokenOptions = {
        clientId,
        redirectUri,
        authorizationCode,
        interactionCode,
        codeVerifier,
    };
    return postToTokenEndpoint(sdk, getTokenOptions, urls)
        .then((response) => {
        const responseType = ['token'];
        if (scopes.indexOf('openid') !== -1) {
            responseType.push('id_token');
        }
        const handleResponseOptions = {
            clientId,
            redirectUri,
            scopes,
            responseType,
            ignoreSignature,
            acrValues
        };
        return handleOAuthResponse(sdk, handleResponseOptions, response, urls)
            .then((response) => {
            response.code = authorizationCode;
            response.state = state;
            return response;
        });
    })
        .finally(() => {
        sdk.transactionManager.clear();
    });
}

export { exchangeCodeForTokens };
//# sourceMappingURL=exchangeCodeForTokens.js.map
