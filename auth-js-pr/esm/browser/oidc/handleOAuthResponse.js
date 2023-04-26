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
import { getOAuthUrls } from './util/oauth.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import OAuthError from '../errors/OAuthError.js';
import { verifyToken } from './verifyToken.js';
import { getDefaultTokenParams } from './util/defaultTokenParams.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';

function validateResponse(res, oauthParams) {
    if (res['error'] && res['error_description']) {
        throw new OAuthError(res['error'], res['error_description']);
    }
    if (res.state !== oauthParams.state) {
        throw new AuthSdkError('OAuth flow response state doesn\'t match request state');
    }
}
async function handleOAuthResponse(sdk, tokenParams, res, urls) {
    const pkce = sdk.options.pkce !== false;
    if (pkce && (res.code || res.interaction_code)) {
        return sdk.token.exchangeCodeForTokens(Object.assign({}, tokenParams, {
            authorizationCode: res.code,
            interactionCode: res.interaction_code
        }), urls);
    }
    tokenParams = tokenParams || getDefaultTokenParams(sdk);
    urls = urls || getOAuthUrls(sdk, tokenParams);
    let responseType = tokenParams.responseType || [];
    if (!Array.isArray(responseType) && responseType !== 'none') {
        responseType = [responseType];
    }
    let scopes;
    if (res.scope) {
        scopes = res.scope.split(' ');
    }
    else {
        scopes = clone(tokenParams.scopes);
    }
    const clientId = tokenParams.clientId || sdk.options.clientId;
    validateResponse(res, tokenParams);
    const tokenDict = {};
    const expiresIn = res.expires_in;
    const tokenType = res.token_type;
    const accessToken = res.access_token;
    const idToken = res.id_token;
    const refreshToken = res.refresh_token;
    const now = Math.floor(Date.now() / 1000);
    if (accessToken) {
        const accessJwt = sdk.token.decode(accessToken);
        tokenDict.accessToken = {
            accessToken: accessToken,
            claims: accessJwt.payload,
            expiresAt: Number(expiresIn) + now,
            tokenType: tokenType,
            scopes: scopes,
            authorizeUrl: urls.authorizeUrl,
            userinfoUrl: urls.userinfoUrl
        };
    }
    if (refreshToken) {
        tokenDict.refreshToken = {
            refreshToken: refreshToken,
            expiresAt: Number(expiresIn) + now,
            scopes: scopes,
            tokenUrl: urls.tokenUrl,
            authorizeUrl: urls.authorizeUrl,
            issuer: urls.issuer,
        };
    }
    if (idToken) {
        const idJwt = sdk.token.decode(idToken);
        const idTokenObj = {
            idToken: idToken,
            claims: idJwt.payload,
            expiresAt: idJwt.payload.exp - idJwt.payload.iat + now,
            scopes: scopes,
            authorizeUrl: urls.authorizeUrl,
            issuer: urls.issuer,
            clientId: clientId
        };
        const validationParams = {
            clientId: clientId,
            issuer: urls.issuer,
            nonce: tokenParams.nonce,
            accessToken: accessToken,
            acrValues: tokenParams.acrValues
        };
        if (tokenParams.ignoreSignature !== undefined) {
            validationParams.ignoreSignature = tokenParams.ignoreSignature;
        }
        await verifyToken(sdk, idTokenObj, validationParams);
        tokenDict.idToken = idTokenObj;
    }
    if (responseType.indexOf('token') !== -1 && !tokenDict.accessToken) {
        throw new AuthSdkError('Unable to parse OAuth flow response: response type "token" was requested but "access_token" was not returned.');
    }
    if (responseType.indexOf('id_token') !== -1 && !tokenDict.idToken) {
        throw new AuthSdkError('Unable to parse OAuth flow response: response type "id_token" was requested but "id_token" was not returned.');
    }
    return {
        tokens: tokenDict,
        state: res.state,
        code: res.code,
        responseType
    };
}

export { handleOAuthResponse };
//# sourceMappingURL=handleOAuthResponse.js.map
