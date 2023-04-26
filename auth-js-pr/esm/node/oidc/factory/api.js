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

import { PromiseQueue } from '../../util/PromiseQueue.js';
import { decodeToken } from '../decodeToken.js';
import { exchangeCodeForTokens } from '../exchangeCodeForTokens.js';
import { getUserInfo } from '../getUserInfo.js';
import { getWithoutPrompt } from '../getWithoutPrompt.js';
import { getWithPopup } from '../getWithPopup.js';
import { getWithRedirect } from '../getWithRedirect.js';
import { parseFromUrl } from '../parseFromUrl.js';
import { renewToken } from '../renewToken.js';
import { renewTokens } from '../renewTokens.js';
import { renewTokensWithRefresh } from '../renewTokensWithRefresh.js';
import { revokeToken } from '../revokeToken.js';
import '../../crypto/node.js';
import { isLoginRedirect } from '../util/loginRedirect.js';
import { prepareTokenParams } from '../util/prepareTokenParams.js';
import { verifyToken } from '../verifyToken.js';
import { enrollAuthenticator } from '../enrollAuthenticator.js';

function createTokenAPI(sdk, queue) {
    const useQueue = (method) => {
        return PromiseQueue.prototype.push.bind(queue, method, null);
    };
    const getWithRedirectFn = useQueue(getWithRedirect.bind(null, sdk));
    const parseFromUrlFn = useQueue(parseFromUrl.bind(null, sdk));
    const parseFromUrlApi = Object.assign(parseFromUrlFn, {
        _getHistory: function () {
            return window.history;
        },
        _getLocation: function () {
            return window.location;
        },
        _getDocument: function () {
            return window.document;
        }
    });
    const token = {
        prepareTokenParams: prepareTokenParams.bind(null, sdk),
        exchangeCodeForTokens: exchangeCodeForTokens.bind(null, sdk),
        getWithoutPrompt: getWithoutPrompt.bind(null, sdk),
        getWithPopup: getWithPopup.bind(null, sdk),
        getWithRedirect: getWithRedirectFn,
        parseFromUrl: parseFromUrlApi,
        decode: decodeToken,
        revoke: revokeToken.bind(null, sdk),
        renew: renewToken.bind(null, sdk),
        renewTokensWithRefresh: renewTokensWithRefresh.bind(null, sdk),
        renewTokens: renewTokens.bind(null, sdk),
        getUserInfo: (accessTokenObject, idTokenObject) => {
            return getUserInfo(sdk, accessTokenObject, idTokenObject);
        },
        verify: verifyToken.bind(null, sdk),
        isLoginRedirect: isLoginRedirect.bind(null, sdk)
    };
    const toWrap = [
        'getWithoutPrompt',
        'getWithPopup',
        'revoke',
        'renew',
        'renewTokensWithRefresh',
        'renewTokens'
    ];
    toWrap.forEach(key => {
        token[key] = useQueue(token[key]);
    });
    return token;
}
function createEndpoints(sdk) {
    return {
        authorize: {
            enrollAuthenticator: enrollAuthenticator.bind(null, sdk),
        }
    };
}

export { createEndpoints, createTokenAPI };
//# sourceMappingURL=api.js.map
