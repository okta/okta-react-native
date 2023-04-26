"use strict";

exports.TRANSACTION_STORAGE_NAME = exports.TOKEN_STORAGE_NAME = exports.STATE_TOKEN_KEY_NAME = exports.SHARED_TRANSACTION_STORAGE_NAME = exports.REFRESH_TOKEN_STORAGE_KEY = exports.REFERRER_PATH_STORAGE_KEY = exports.PKCE_STORAGE_NAME = exports.ORIGINAL_URI_STORAGE_NAME = exports.MIN_VERIFIER_LENGTH = exports.MAX_VERIFIER_LENGTH = exports.ID_TOKEN_STORAGE_KEY = exports.IDX_RESPONSE_STORAGE_NAME = exports.IDX_API_VERSION = exports.DEFAULT_POLLING_DELAY = exports.DEFAULT_MAX_CLOCK_SKEW = exports.DEFAULT_CODE_CHALLENGE_METHOD = exports.DEFAULT_CACHE_DURATION = exports.CACHE_STORAGE_NAME = exports.ACCESS_TOKEN_STORAGE_KEY = void 0;
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
exports.STATE_TOKEN_KEY_NAME = STATE_TOKEN_KEY_NAME;
const DEFAULT_POLLING_DELAY = 500;
exports.DEFAULT_POLLING_DELAY = DEFAULT_POLLING_DELAY;
const DEFAULT_MAX_CLOCK_SKEW = 300;
exports.DEFAULT_MAX_CLOCK_SKEW = DEFAULT_MAX_CLOCK_SKEW;
const DEFAULT_CACHE_DURATION = 86400;
exports.DEFAULT_CACHE_DURATION = DEFAULT_CACHE_DURATION;
const TOKEN_STORAGE_NAME = 'okta-token-storage';
exports.TOKEN_STORAGE_NAME = TOKEN_STORAGE_NAME;
const CACHE_STORAGE_NAME = 'okta-cache-storage';
exports.CACHE_STORAGE_NAME = CACHE_STORAGE_NAME;
const PKCE_STORAGE_NAME = 'okta-pkce-storage';
exports.PKCE_STORAGE_NAME = PKCE_STORAGE_NAME;
const TRANSACTION_STORAGE_NAME = 'okta-transaction-storage';
exports.TRANSACTION_STORAGE_NAME = TRANSACTION_STORAGE_NAME;
const SHARED_TRANSACTION_STORAGE_NAME = 'okta-shared-transaction-storage';
exports.SHARED_TRANSACTION_STORAGE_NAME = SHARED_TRANSACTION_STORAGE_NAME;
const ORIGINAL_URI_STORAGE_NAME = 'okta-original-uri-storage';
exports.ORIGINAL_URI_STORAGE_NAME = ORIGINAL_URI_STORAGE_NAME;
const IDX_RESPONSE_STORAGE_NAME = 'okta-idx-response-storage';
exports.IDX_RESPONSE_STORAGE_NAME = IDX_RESPONSE_STORAGE_NAME;
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
exports.ACCESS_TOKEN_STORAGE_KEY = ACCESS_TOKEN_STORAGE_KEY;
const ID_TOKEN_STORAGE_KEY = 'idToken';
exports.ID_TOKEN_STORAGE_KEY = ID_TOKEN_STORAGE_KEY;
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
exports.REFRESH_TOKEN_STORAGE_KEY = REFRESH_TOKEN_STORAGE_KEY;
const REFERRER_PATH_STORAGE_KEY = 'referrerPath';

// Code verifier: Random URL-safe string with a minimum length of 43 characters.
// Code challenge: Base64 URL-encoded SHA-256 hash of the code verifier.
exports.REFERRER_PATH_STORAGE_KEY = REFERRER_PATH_STORAGE_KEY;
const MIN_VERIFIER_LENGTH = 43;
exports.MIN_VERIFIER_LENGTH = MIN_VERIFIER_LENGTH;
const MAX_VERIFIER_LENGTH = 128;
exports.MAX_VERIFIER_LENGTH = MAX_VERIFIER_LENGTH;
const DEFAULT_CODE_CHALLENGE_METHOD = 'S256';
exports.DEFAULT_CODE_CHALLENGE_METHOD = DEFAULT_CODE_CHALLENGE_METHOD;
const IDX_API_VERSION = '1.0.0';
exports.IDX_API_VERSION = IDX_API_VERSION;
//# sourceMappingURL=constants.js.map