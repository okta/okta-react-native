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
import { clone } from '../util/object.js';
import { createOAuthMeta } from './util/oauthMeta.js';
import { prepareTokenParams } from './util/prepareTokenParams.js';
import { buildAuthorizeParams } from './endpoints/authorize.js';

async function getWithRedirect(sdk, options) {
    if (arguments.length > 2) {
        return Promise.reject(new AuthSdkError('As of version 3.0, "getWithRedirect" takes only a single set of options'));
    }
    options = clone(options) || {};
    const tokenParams = await prepareTokenParams(sdk, options);
    const meta = createOAuthMeta(sdk, tokenParams);
    const requestUrl = meta.urls.authorizeUrl + buildAuthorizeParams(tokenParams);
    sdk.transactionManager.save(meta);
    if (sdk.options.setLocation) {
        sdk.options.setLocation(requestUrl);
    }
    else {
        window.location.assign(requestUrl);
    }
}

export { getWithRedirect };
//# sourceMappingURL=getWithRedirect.js.map
