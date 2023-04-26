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
import OAuthError from '../errors/OAuthError.js';

async function handleInteractionCodeRedirect(authClient, url) {
    const meta = authClient.transactionManager.load();
    if (!meta) {
        throw new AuthSdkError('No transaction data was found in storage');
    }
    const { codeVerifier, state: savedState } = meta;
    const { searchParams
     } = new URL(url);
    const state = searchParams.get('state');
    const interactionCode = searchParams.get('interaction_code');
    const error = searchParams.get('error');
    if (error) {
        throw new OAuthError(error, searchParams.get('error_description'));
    }
    if (state !== savedState) {
        throw new AuthSdkError('State in redirect uri does not match with transaction state');
    }
    if (!interactionCode) {
        throw new AuthSdkError('Unable to parse interaction_code from the url');
    }
    const { tokens } = await authClient.token.exchangeCodeForTokens({ interactionCode, codeVerifier });
    authClient.tokenManager.setTokens(tokens);
}

export { handleInteractionCodeRedirect };
//# sourceMappingURL=handleInteractionCodeRedirect.js.map
