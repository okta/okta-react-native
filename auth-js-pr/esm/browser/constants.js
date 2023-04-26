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

const STATE_TOKEN_KEY_NAME = 'oktaStateToken';
const DEFAULT_POLLING_DELAY = 500;
const DEFAULT_MAX_CLOCK_SKEW = 300;
const DEFAULT_CACHE_DURATION = 86400;
const TOKEN_STORAGE_NAME = 'okta-token-storage';
const CACHE_STORAGE_NAME = 'okta-cache-storage';
const PKCE_STORAGE_NAME = 'okta-pkce-storage';
const TRANSACTION_STORAGE_NAME = 'okta-transaction-storage';
const SHARED_TRANSACTION_STORAGE_NAME = 'okta-shared-transaction-storage';
const ORIGINAL_URI_STORAGE_NAME = 'okta-original-uri-storage';
const IDX_RESPONSE_STORAGE_NAME = 'okta-idx-response-storage';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const ID_TOKEN_STORAGE_KEY = 'idToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const REFERRER_PATH_STORAGE_KEY = 'referrerPath';
const MIN_VERIFIER_LENGTH = 43;
const MAX_VERIFIER_LENGTH = 128;
const DEFAULT_CODE_CHALLENGE_METHOD = 'S256';
const IDX_API_VERSION = '1.0.0';

export { ACCESS_TOKEN_STORAGE_KEY, CACHE_STORAGE_NAME, DEFAULT_CACHE_DURATION, DEFAULT_CODE_CHALLENGE_METHOD, DEFAULT_MAX_CLOCK_SKEW, DEFAULT_POLLING_DELAY, IDX_API_VERSION, IDX_RESPONSE_STORAGE_NAME, ID_TOKEN_STORAGE_KEY, MAX_VERIFIER_LENGTH, MIN_VERIFIER_LENGTH, ORIGINAL_URI_STORAGE_NAME, PKCE_STORAGE_NAME, REFERRER_PATH_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, SHARED_TRANSACTION_STORAGE_NAME, STATE_TOKEN_KEY_NAME, TOKEN_STORAGE_NAME, TRANSACTION_STORAGE_NAME };
//# sourceMappingURL=constants.js.map
