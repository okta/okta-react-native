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
import { getOAuthUrls } from './util/oauth.js';
import { isSameRefreshToken } from './util/refreshToken.js';
import { handleOAuthResponse } from './handleOAuthResponse.js';
import { postRefreshToken } from './endpoints/token.js';
import { isRefreshTokenInvalidError } from './util/errors.js';

async function renewTokensWithRefresh(sdk, tokenParams, refreshTokenObject) {
    const { clientId } = sdk.options;
    if (!clientId) {
        throw new AuthSdkError('A clientId must be specified in the OktaAuth constructor to renew tokens');
    }
    try {
        const renewTokenParams = Object.assign({}, tokenParams, {
            clientId,
        });
        const tokenResponse = await postRefreshToken(sdk, renewTokenParams, refreshTokenObject);
        const urls = getOAuthUrls(sdk, tokenParams);
        const { tokens } = await handleOAuthResponse(sdk, renewTokenParams, tokenResponse, urls);
        const { refreshToken } = tokens;
        if (refreshToken && !isSameRefreshToken(refreshToken, refreshTokenObject)) {
            sdk.tokenManager.updateRefreshToken(refreshToken);
        }
        return tokens;
    }
    catch (err) {
        if (isRefreshTokenInvalidError(err)) {
            sdk.tokenManager.removeRefreshToken();
        }
        throw err;
    }
}

export { renewTokensWithRefresh };
//# sourceMappingURL=renewTokensWithRefresh.js.map
