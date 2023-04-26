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

import { removeNils, clone } from '../util/object.js';
import { isString } from '../util/types.js';
import { isAbsoluteUrl } from '../util/url.js';
import { STATE_TOKEN_KEY_NAME, DEFAULT_CACHE_DURATION } from '../constants.js';
import AuthApiError from '../errors/AuthApiError.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import OAuthError from '../errors/OAuthError.js';

const parseInsufficientAuthenticationError = (header) => {
    if (!header) {
        throw new AuthSdkError('Missing header string');
    }
    return header
        .split(',')
        .map(part => part.trim())
        .map(part => part.split('='))
        .reduce((acc, curr) => {
        acc[curr[0]] = curr[1].replace(/^"(.*)"$/, '$1');
        return acc;
    }, {});
};
const formatError = (sdk, resp) => {
    var _a, _b;
    let err;
    let serverErr = {};
    if (resp.responseText && isString(resp.responseText)) {
        try {
            serverErr = JSON.parse(resp.responseText);
        }
        catch (e) {
            serverErr = {
                errorSummary: 'Unknown error'
            };
        }
    }
    if (resp.status >= 500) {
        serverErr.errorSummary = 'Unknown error';
    }
    if (sdk.options.transformErrorXHR) {
        resp = sdk.options.transformErrorXHR(clone(resp));
    }
    if (serverErr.error && serverErr.error_description) {
        err = new OAuthError(serverErr.error, serverErr.error_description);
    }
    else {
        err = new AuthApiError(serverErr, resp);
    }
    if ((resp === null || resp === void 0 ? void 0 : resp.status) === 403 && !!((_a = resp === null || resp === void 0 ? void 0 : resp.headers) === null || _a === void 0 ? void 0 : _a['www-authenticate'])) {
        const { error,
        error_description,
        max_age,
        acr_values } = parseInsufficientAuthenticationError((_b = resp === null || resp === void 0 ? void 0 : resp.headers) === null || _b === void 0 ? void 0 : _b['www-authenticate']);
        if (error === 'insufficient_authentication_context') {
            err = new AuthApiError({
                errorSummary: error,
                errorCauses: [{ errorSummary: error_description }]
            }, resp, Object.assign({
                max_age: +max_age }, (acr_values && { acr_values })));
        }
    }
    return err;
};
function httpRequest(sdk, options) {
    options = options || {};
    if (sdk.options.httpRequestInterceptors) {
        for (const interceptor of sdk.options.httpRequestInterceptors) {
            interceptor(options);
        }
    }
    var url = options.url, method = options.method, args = options.args, saveAuthnState = options.saveAuthnState, accessToken = options.accessToken, withCredentials = options.withCredentials === true,
    storageUtil = sdk.options.storageUtil, storage = storageUtil.storage, httpCache = sdk.storageManager.getHttpCache(sdk.options.cookies);
    if (options.cacheResponse) {
        var cacheContents = httpCache.getStorage();
        var cachedResponse = cacheContents[url];
        if (cachedResponse && Date.now() / 1000 < cachedResponse.expiresAt) {
            return Promise.resolve(cachedResponse.response);
        }
    }
    var oktaUserAgentHeader = sdk._oktaUserAgent.getHttpHeader();
    var headers = Object.assign({ 'Accept': 'application/json', 'Content-Type': 'application/json' }, oktaUserAgentHeader);
    Object.assign(headers, sdk.options.headers, options.headers);
    headers = removeNils(headers);
    if (accessToken && isString(accessToken)) {
        headers['Authorization'] = 'Bearer ' + accessToken;
    }
    var ajaxOptions = {
        headers,
        data: args || undefined,
        withCredentials
    };
    var err, res;
    return sdk.options.httpRequestClient(method, url, ajaxOptions)
        .then(function (resp) {
        res = resp.responseText;
        if (res && isString(res)) {
            res = JSON.parse(res);
            if (res && typeof res === 'object' && !res.headers) {
                if (Array.isArray(res)) {
                    res.forEach(item => {
                        item.headers = resp.headers;
                    });
                }
                else {
                    res.headers = resp.headers;
                }
            }
        }
        if (saveAuthnState) {
            if (!res.stateToken) {
                storage.delete(STATE_TOKEN_KEY_NAME);
            }
        }
        if (res && res.stateToken && res.expiresAt) {
            storage.set(STATE_TOKEN_KEY_NAME, res.stateToken, res.expiresAt, sdk.options.cookies);
        }
        if (res && options.cacheResponse) {
            httpCache.updateStorage(url, {
                expiresAt: Math.floor(Date.now() / 1000) + DEFAULT_CACHE_DURATION,
                response: res
            });
        }
        return res;
    })
        .catch(function (resp) {
        err = formatError(sdk, resp);
        if (err.errorCode === 'E0000011') {
            storage.delete(STATE_TOKEN_KEY_NAME);
        }
        throw err;
    });
}
function get(sdk, url, options) {
    url = isAbsoluteUrl(url) ? url : sdk.getIssuerOrigin() + url;
    var getOptions = {
        url: url,
        method: 'GET'
    };
    Object.assign(getOptions, options);
    return httpRequest(sdk, getOptions);
}
function post(sdk, url, args, options) {
    url = isAbsoluteUrl(url) ? url : sdk.getIssuerOrigin() + url;
    var postOptions = {
        url: url,
        method: 'POST',
        args: args,
        saveAuthnState: true
    };
    Object.assign(postOptions, options);
    return httpRequest(sdk, postOptions);
}

export { get, httpRequest, post };
//# sourceMappingURL=request.js.map
