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

import { DEFAULT_MAX_CLOCK_SKEW } from '../../constants.js';
import { removeTrailingSlash, toAbsoluteUrl } from '../../util/url.js';
import { isBrowser } from '../../features.js';
import { createHttpOptionsConstructor } from '../../http/options.js';
import { enableSharedStorage } from './node.js';
import AuthSdkError from '../../errors/AuthSdkError.js';

function assertValidConfig(args) {
    args = args || {};
    var scopes = args.scopes;
    if (scopes && !Array.isArray(scopes)) {
        throw new AuthSdkError('scopes must be a array of strings. ' +
            'Required usage: new OktaAuth({scopes: ["openid", "email"]})');
    }
    var issuer = args.issuer;
    if (!issuer) {
        throw new AuthSdkError('No issuer passed to constructor. ' +
            'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com/oauth2/{authServerId}"})');
    }
    var isUrlRegex = new RegExp('^http?s?://.+');
    if (!isUrlRegex.test(issuer)) {
        throw new AuthSdkError('Issuer must be a valid URL. ' +
            'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com/oauth2/{authServerId}"})');
    }
    if (issuer.indexOf('-admin.') !== -1) {
        throw new AuthSdkError('Issuer URL passed to constructor contains "-admin" in subdomain. ' +
            'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com})');
    }
}
function createOAuthOptionsConstructor() {
    const HttpOptionsConstructor = createHttpOptionsConstructor();
    return class OAuthOptionsConstructor extends HttpOptionsConstructor {
        constructor(options) {
            super(options);
            assertValidConfig(options);
            this.issuer = removeTrailingSlash(options.issuer);
            this.tokenUrl = removeTrailingSlash(options.tokenUrl);
            this.authorizeUrl = removeTrailingSlash(options.authorizeUrl);
            this.userinfoUrl = removeTrailingSlash(options.userinfoUrl);
            this.revokeUrl = removeTrailingSlash(options.revokeUrl);
            this.logoutUrl = removeTrailingSlash(options.logoutUrl);
            this.pkce = options.pkce === false ? false : true;
            this.clientId = options.clientId;
            this.redirectUri = options.redirectUri;
            if (isBrowser()) {
                this.redirectUri = toAbsoluteUrl(options.redirectUri, window.location.origin);
            }
            this.responseType = options.responseType;
            this.responseMode = options.responseMode;
            this.state = options.state;
            this.scopes = options.scopes;
            this.ignoreSignature = !!options.ignoreSignature;
            this.codeChallenge = options.codeChallenge;
            this.codeChallengeMethod = options.codeChallengeMethod;
            this.acrValues = options.acrValues;
            this.maxAge = options.maxAge;
            this.tokenManager = options.tokenManager;
            this.postLogoutRedirectUri = options.postLogoutRedirectUri;
            this.restoreOriginalUri = options.restoreOriginalUri;
            this.transactionManager = Object.assign({ enableSharedStorage }, options.transactionManager);
            this.clientSecret = options.clientSecret;
            this.setLocation = options.setLocation;
            this.ignoreLifetime = !!options.ignoreLifetime;
            if (!options.maxClockSkew && options.maxClockSkew !== 0) {
                this.maxClockSkew = DEFAULT_MAX_CLOCK_SKEW;
            }
            else {
                this.maxClockSkew = options.maxClockSkew;
            }
        }
    };
}

export { createOAuthOptionsConstructor };
//# sourceMappingURL=OAuthOptionsConstructor.js.map
