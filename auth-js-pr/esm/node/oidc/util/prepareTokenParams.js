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

import { getWellKnown } from '../endpoints/well-known.js';
import AuthSdkError from '../../errors/AuthSdkError.js';
import { getDefaultTokenParams } from './defaultTokenParams.js';
import { DEFAULT_CODE_CHALLENGE_METHOD } from '../../constants.js';
import PKCE from './pkce.js';

function assertPKCESupport(sdk) {
    if (!sdk.features.isPKCESupported()) {
        var errorMessage = 'PKCE requires a modern browser with encryption support running in a secure context.';
        if (!sdk.features.isHTTPS()) {
            errorMessage += '\nThe current page is not being served with HTTPS protocol. PKCE requires secure HTTPS protocol.';
        }
        if (!sdk.features.hasTextEncoder()) {
            errorMessage += '\n"TextEncoder" is not defined. To use PKCE, you may need to include a polyfill/shim for this browser.';
        }
        throw new AuthSdkError(errorMessage);
    }
}
async function validateCodeChallengeMethod(sdk, codeChallengeMethod) {
    codeChallengeMethod = codeChallengeMethod || sdk.options.codeChallengeMethod || DEFAULT_CODE_CHALLENGE_METHOD;
    const wellKnownResponse = await getWellKnown(sdk);
    var methods = wellKnownResponse['code_challenge_methods_supported'] || [];
    if (methods.indexOf(codeChallengeMethod) === -1) {
        throw new AuthSdkError('Invalid code_challenge_method');
    }
    return codeChallengeMethod;
}
async function preparePKCE(sdk, tokenParams) {
    let { codeVerifier, codeChallenge, codeChallengeMethod } = tokenParams;
    codeChallenge = codeChallenge || sdk.options.codeChallenge;
    if (!codeChallenge) {
        assertPKCESupport(sdk);
        codeVerifier = codeVerifier || PKCE.generateVerifier();
        codeChallenge = await PKCE.computeChallenge(codeVerifier);
    }
    codeChallengeMethod = await validateCodeChallengeMethod(sdk, codeChallengeMethod);
    tokenParams = Object.assign(Object.assign({}, tokenParams), { responseType: 'code',
        codeVerifier,
        codeChallenge,
        codeChallengeMethod });
    return tokenParams;
}
async function prepareTokenParams(sdk, tokenParams = {}) {
    const defaults = getDefaultTokenParams(sdk);
    tokenParams = Object.assign(Object.assign({}, defaults), tokenParams);
    if (tokenParams.pkce === false) {
        return tokenParams;
    }
    return preparePKCE(sdk, tokenParams);
}

export { assertPKCESupport, preparePKCE, prepareTokenParams, validateCodeChallengeMethod };
//# sourceMappingURL=prepareTokenParams.js.map
