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

import { addPostMessageListener, loadFrame } from './util/browser.js';
import { getOAuthUrls } from './util/oauth.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import { prepareTokenParams } from './util/prepareTokenParams.js';
import { buildAuthorizeParams } from './endpoints/authorize.js';
import { handleOAuthResponse } from './handleOAuthResponse.js';

function getToken(sdk, options) {
    if (arguments.length > 2) {
        return Promise.reject(new AuthSdkError('As of version 3.0, "getToken" takes only a single set of options'));
    }
    options = options || {};
    const popupWindow = options.popupWindow;
    options.popupWindow = undefined;
    return prepareTokenParams(sdk, options)
        .then(function (tokenParams) {
        var sessionTokenOverrides = {
            prompt: 'none',
            responseMode: 'okta_post_message',
            display: null
        };
        var idpOverrides = {
            display: 'popup'
        };
        if (options.sessionToken) {
            Object.assign(tokenParams, sessionTokenOverrides);
        }
        else if (options.idp) {
            Object.assign(tokenParams, idpOverrides);
        }
        var requestUrl, endpoint, urls;
        urls = getOAuthUrls(sdk, tokenParams);
        endpoint = options.codeVerifier ? urls.tokenUrl : urls.authorizeUrl;
        requestUrl = endpoint + buildAuthorizeParams(tokenParams);
        var flowType;
        if (tokenParams.sessionToken || tokenParams.display === null) {
            flowType = 'IFRAME';
        }
        else if (tokenParams.display === 'popup') {
            flowType = 'POPUP';
        }
        else {
            flowType = 'IMPLICIT';
        }
        switch (flowType) {
            case 'IFRAME':
                var iframePromise = addPostMessageListener(sdk, options.timeout, tokenParams.state);
                var iframeEl = loadFrame(requestUrl);
                return iframePromise
                    .then(function (res) {
                    return handleOAuthResponse(sdk, tokenParams, res, urls);
                })
                    .finally(function () {
                    var _a;
                    if (document.body.contains(iframeEl)) {
                        (_a = iframeEl.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(iframeEl);
                    }
                });
            case 'POPUP':
                var oauthPromise;
                if (tokenParams.responseMode === 'okta_post_message') {
                    if (!sdk.features.isPopupPostMessageSupported()) {
                        throw new AuthSdkError('This browser doesn\'t have full postMessage support');
                    }
                    oauthPromise = addPostMessageListener(sdk, options.timeout, tokenParams.state);
                }
                if (popupWindow) {
                    popupWindow.location.assign(requestUrl);
                }
                var popupPromise = new Promise(function (resolve, reject) {
                    var closePoller = setInterval(function () {
                        if (!popupWindow || popupWindow.closed) {
                            clearInterval(closePoller);
                            reject(new AuthSdkError('Unable to parse OAuth flow response'));
                        }
                    }, 100);
                    oauthPromise
                        .then(function (res) {
                        clearInterval(closePoller);
                        resolve(res);
                    })
                        .catch(function (err) {
                        clearInterval(closePoller);
                        reject(err);
                    });
                });
                return popupPromise
                    .then(function (res) {
                    return handleOAuthResponse(sdk, tokenParams, res, urls);
                })
                    .finally(function () {
                    if (popupWindow && !popupWindow.closed) {
                        popupWindow.close();
                    }
                });
            default:
                throw new AuthSdkError('The full page redirect flow is not supported');
        }
    });
}

export { getToken };
//# sourceMappingURL=getToken.js.map
