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
import { isString } from '../util/types.js';
import '../crypto/node.js';
import { isInteractionRequiredError } from './util/errors.js';
import 'tiny-emitter';
import '../server/serverStorage.js';
import 'cross-fetch';
import { urlParamsToObject } from './util/urlParams.js';
import { handleOAuthResponse } from './handleOAuthResponse.js';

function removeHash(sdk) {
    var nativeHistory = sdk.token.parseFromUrl._getHistory();
    var nativeDoc = sdk.token.parseFromUrl._getDocument();
    var nativeLoc = sdk.token.parseFromUrl._getLocation();
    if (nativeHistory && nativeHistory.replaceState) {
        nativeHistory.replaceState(null, nativeDoc.title, nativeLoc.pathname + nativeLoc.search);
    }
    else {
        nativeLoc.hash = '';
    }
}
function removeSearch(sdk) {
    var nativeHistory = sdk.token.parseFromUrl._getHistory();
    var nativeDoc = sdk.token.parseFromUrl._getDocument();
    var nativeLoc = sdk.token.parseFromUrl._getLocation();
    if (nativeHistory && nativeHistory.replaceState) {
        nativeHistory.replaceState(null, nativeDoc.title, nativeLoc.pathname + nativeLoc.hash);
    }
    else {
        nativeLoc.search = '';
    }
}
function getResponseMode(sdk) {
    var defaultResponseMode = sdk.options.pkce ? 'query' : 'fragment';
    var responseMode = sdk.options.responseMode || defaultResponseMode;
    return responseMode;
}
function parseOAuthResponseFromUrl(sdk, options) {
    options = options || {};
    if (isString(options)) {
        options = { url: options };
    }
    else {
        options = options;
    }
    var url = options.url;
    var responseMode = options.responseMode || getResponseMode(sdk);
    var nativeLoc = sdk.token.parseFromUrl._getLocation();
    var paramStr;
    if (responseMode === 'query') {
        paramStr = url ? url.substring(url.indexOf('?')) : nativeLoc.search;
    }
    else {
        paramStr = url ? url.substring(url.indexOf('#')) : nativeLoc.hash;
    }
    if (!paramStr) {
        throw new AuthSdkError('Unable to parse a token from the url');
    }
    return urlParamsToObject(paramStr);
}
function cleanOAuthResponseFromUrl(sdk, options) {
    const responseMode = options.responseMode || getResponseMode(sdk);
    responseMode === 'query' ? removeSearch(sdk) : removeHash(sdk);
}
async function parseFromUrl(sdk, options) {
    options = options || {};
    if (isString(options)) {
        options = { url: options };
    }
    else {
        options = options;
    }
    const res = parseOAuthResponseFromUrl(sdk, options);
    const state = res.state;
    const oauthParams = sdk.transactionManager.load({
        state
    });
    if (!oauthParams) {
        if (sdk.options.pkce) {
            throw new AuthSdkError('Could not load PKCE codeVerifier from storage. This may indicate the auth flow has already completed or multiple auth flows are executing concurrently.', undefined);
        }
        throw new AuthSdkError('Unable to retrieve OAuth redirect params from storage');
    }
    const urls = oauthParams.urls;
    delete oauthParams.urls;
    if (!options.url) {
        cleanOAuthResponseFromUrl(sdk, options);
    }
    return handleOAuthResponse(sdk, oauthParams, res, urls)
        .catch(err => {
        if (!isInteractionRequiredError(err)) {
            sdk.transactionManager.clear({
                state
            });
        }
        throw err;
    })
        .then(res => {
        sdk.transactionManager.clear({
            state
        });
        return res;
    });
}

export { cleanOAuthResponseFromUrl, getResponseMode, parseFromUrl, parseOAuthResponseFromUrl };
//# sourceMappingURL=parseFromUrl.js.map
