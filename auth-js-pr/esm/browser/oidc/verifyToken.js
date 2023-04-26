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

import { getWellKnown, getKey } from './endpoints/well-known.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import { getOidcHash } from '../crypto/oidcHash.js';
import { verifyToken as verifyToken$1 } from '../crypto/verifyToken.js';
import { validateClaims } from './util/validateClaims.js';
import { decodeToken } from './decodeToken.js';

async function verifyToken(sdk, token, validationParams) {
    if (!token || !token.idToken) {
        throw new AuthSdkError('Only idTokens may be verified');
    }
    const jwt = decodeToken(token.idToken);
    const configuredIssuer = (validationParams === null || validationParams === void 0 ? void 0 : validationParams.issuer) || sdk.options.issuer;
    const { issuer } = await getWellKnown(sdk, configuredIssuer);
    const validationOptions = Object.assign({
        clientId: sdk.options.clientId,
        ignoreSignature: sdk.options.ignoreSignature
    }, validationParams, {
        issuer
    });
    validateClaims(sdk, jwt.payload, validationOptions);
    if (validationOptions.ignoreSignature == true || !sdk.features.isTokenVerifySupported()) {
        return token;
    }
    const key = await getKey(sdk, token.issuer, jwt.header.kid);
    const valid = await verifyToken$1(token.idToken, key);
    if (!valid) {
        throw new AuthSdkError('The token signature is not valid');
    }
    if (validationParams && validationParams.accessToken && token.claims.at_hash) {
        const hash = await getOidcHash(validationParams.accessToken);
        if (hash !== token.claims.at_hash) {
            throw new AuthSdkError('Token hash verification failed');
        }
    }
    return token;
}

export { verifyToken };
//# sourceMappingURL=verifyToken.js.map
