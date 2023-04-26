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
import { removeNils } from '../../util/object.js';
import { toQueryString } from '../../util/url.js';
import { httpRequest } from '../../http/request.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';

function validateOptions(options) {
    if (!options.clientId) {
        throw new AuthSdkError('A clientId must be specified in the OktaAuth constructor to get a token');
    }
    if (!options.redirectUri) {
        throw new AuthSdkError('The redirectUri passed to /authorize must also be passed to /token');
    }
    if (!options.authorizationCode && !options.interactionCode) {
        throw new AuthSdkError('An authorization code (returned from /authorize) must be passed to /token');
    }
    if (!options.codeVerifier) {
        throw new AuthSdkError('The "codeVerifier" (generated and saved by your app) must be passed to /token');
    }
}
function getPostData(sdk, options) {
    var params = removeNils({
        'client_id': options.clientId,
        'redirect_uri': options.redirectUri,
        'grant_type': options.interactionCode ? 'interaction_code' : 'authorization_code',
        'code_verifier': options.codeVerifier
    });
    if (options.interactionCode) {
        params['interaction_code'] = options.interactionCode;
    }
    else if (options.authorizationCode) {
        params.code = options.authorizationCode;
    }
    const { clientSecret } = sdk.options;
    if (clientSecret) {
        params['client_secret'] = clientSecret;
    }
    return toQueryString(params).slice(1);
}
function postToTokenEndpoint(sdk, options, urls) {
    validateOptions(options);
    var data = getPostData(sdk, options);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return httpRequest(sdk, {
        url: urls.tokenUrl,
        method: 'POST',
        args: data,
        headers
    });
}
function postRefreshToken(sdk, options, refreshToken) {
    return httpRequest(sdk, {
        url: refreshToken.tokenUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        args: Object.entries({
            client_id: options.clientId,
            grant_type: 'refresh_token',
            scope: refreshToken.scopes.join(' '),
            refresh_token: refreshToken.refreshToken,
        }).map(function ([name, value]) {
            return name + '=' + encodeURIComponent(value);
        }).join('&'),
    });
}

export { postRefreshToken, postToTokenEndpoint };
//# sourceMappingURL=token.js.map
