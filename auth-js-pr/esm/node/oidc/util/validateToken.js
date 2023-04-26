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
import { isIDToken, isAccessToken, isRefreshToken } from '../types/Token.js';

function validateToken(token, type) {
    if (!isIDToken(token) && !isAccessToken(token) && !isRefreshToken(token)) {
        throw new AuthSdkError('Token must be an Object with scopes, expiresAt, and one of: an idToken, accessToken, or refreshToken property');
    }
    if (type === 'accessToken' && !isAccessToken(token)) {
        throw new AuthSdkError('invalid accessToken');
    }
    if (type === 'idToken' && !isIDToken(token)) {
        throw new AuthSdkError('invalid idToken');
    }
    if (type === 'refreshToken' && !isRefreshToken(token)) {
        throw new AuthSdkError('invalid refreshToken');
    }
}

export { validateToken };
//# sourceMappingURL=validateToken.js.map
