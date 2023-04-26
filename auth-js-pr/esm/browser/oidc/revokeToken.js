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
import { btoa as b } from '../crypto/browser.js';
import { toQueryString } from '../util/url.js';
import { post } from '../http/request.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';
import { getOAuthUrls } from './util/oauth.js';

async function revokeToken(sdk, token) {
    let accessToken = '';
    let refreshToken = '';
    if (token) {
        accessToken = token.accessToken;
        refreshToken = token.refreshToken;
    }
    if (!accessToken && !refreshToken) {
        throw new AuthSdkError('A valid access or refresh token object is required');
    }
    var clientId = sdk.options.clientId;
    var clientSecret = sdk.options.clientSecret;
    if (!clientId) {
        throw new AuthSdkError('A clientId must be specified in the OktaAuth constructor to revoke a token');
    }
    var revokeUrl = getOAuthUrls(sdk).revokeUrl;
    var args = toQueryString({
        token_type_hint: refreshToken ? 'refresh_token' : 'access_token',
        token: refreshToken || accessToken,
    }).slice(1);
    var creds = clientSecret ? b(`${clientId}:${clientSecret}`) : b(clientId);
    return post(sdk, revokeUrl, args, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + creds
        }
    });
}

export { revokeToken };
//# sourceMappingURL=revokeToken.js.map
