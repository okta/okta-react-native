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

import { __rest } from '../../_virtual/_tslib.js';
import * as index from '../../crypto/index.js';
import { httpRequest } from '../../http/request.js';
import { PromiseQueue } from '../../util/PromiseQueue.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';
import PKCE from '../util/pkce.js';
import { createTokenAPI, createEndpoints } from '../factory/api.js';
import { TokenManager } from '../TokenManager.js';
import { getOAuthUrls } from '../util/oauth.js';
import { isLoginRedirect } from '../util/loginRedirect.js';
import { provideOriginalUri } from './browser.js';

function mixinOAuth(Base, TransactionManagerConstructor) {
    var _a;
    const WithOriginalUri = provideOriginalUri(Base);
    return _a = class OktaAuthOAuth extends WithOriginalUri {
            constructor(...args) {
                super(...args);
                this.transactionManager = new TransactionManagerConstructor(Object.assign({
                    storageManager: this.storageManager,
                }, this.options.transactionManager));
                this.pkce = {
                    DEFAULT_CODE_CHALLENGE_METHOD: PKCE.DEFAULT_CODE_CHALLENGE_METHOD,
                    generateVerifier: PKCE.generateVerifier,
                    computeChallenge: PKCE.computeChallenge
                };
                this._pending = { handleLogin: false };
                this._tokenQueue = new PromiseQueue();
                this.token = createTokenAPI(this, this._tokenQueue);
                this.tokenManager = new TokenManager(this, this.options.tokenManager);
                this.endpoints = createEndpoints(this);
            }
            clearStorage() {
                super.clearStorage();
                this.tokenManager.clear();
            }
            async isAuthenticated(options = {}) {
                const { autoRenew, autoRemove } = this.tokenManager.getOptions();
                const shouldRenew = options.onExpiredToken ? options.onExpiredToken === 'renew' : autoRenew;
                const shouldRemove = options.onExpiredToken ? options.onExpiredToken === 'remove' : autoRemove;
                let { accessToken } = this.tokenManager.getTokensSync();
                if (accessToken && this.tokenManager.hasExpired(accessToken)) {
                    accessToken = undefined;
                    if (shouldRenew) {
                        try {
                            accessToken = await this.tokenManager.renew('accessToken');
                        }
                        catch (_a) {
                        }
                    }
                    else if (shouldRemove) {
                        this.tokenManager.remove('accessToken');
                    }
                }
                let { idToken } = this.tokenManager.getTokensSync();
                if (idToken && this.tokenManager.hasExpired(idToken)) {
                    idToken = undefined;
                    if (shouldRenew) {
                        try {
                            idToken = await this.tokenManager.renew('idToken');
                        }
                        catch (_b) {
                        }
                    }
                    else if (shouldRemove) {
                        this.tokenManager.remove('idToken');
                    }
                }
                return !!(accessToken && idToken);
            }
            async signInWithRedirect(opts = {}) {
                const { originalUri } = opts, additionalParams = __rest(opts, ["originalUri"]);
                if (this._pending.handleLogin) {
                    return;
                }
                this._pending.handleLogin = true;
                try {
                    if (originalUri) {
                        this.setOriginalUri(originalUri);
                    }
                    const params = Object.assign({
                        scopes: this.options.scopes || ['openid', 'email', 'profile']
                    }, additionalParams);
                    await this.token.getWithRedirect(params);
                }
                finally {
                    this._pending.handleLogin = false;
                }
            }
            async getUser() {
                const { idToken, accessToken } = this.tokenManager.getTokensSync();
                return this.token.getUserInfo(accessToken, idToken);
            }
            getIdToken() {
                const { idToken } = this.tokenManager.getTokensSync();
                return idToken ? idToken.idToken : undefined;
            }
            getAccessToken() {
                const { accessToken } = this.tokenManager.getTokensSync();
                return accessToken ? accessToken.accessToken : undefined;
            }
            getRefreshToken() {
                const { refreshToken } = this.tokenManager.getTokensSync();
                return refreshToken ? refreshToken.refreshToken : undefined;
            }
            async storeTokensFromRedirect() {
                const { tokens, responseType } = await this.token.parseFromUrl();
                if (responseType !== 'none') {
                    this.tokenManager.setTokens(tokens);
                }
            }
            isLoginRedirect() {
                return isLoginRedirect(this);
            }
            isPKCE() {
                return !!this.options.pkce;
            }
            hasResponseType(responseType) {
                let hasResponseType = false;
                if (Array.isArray(this.options.responseType) && this.options.responseType.length) {
                    hasResponseType = this.options.responseType.indexOf(responseType) >= 0;
                }
                else {
                    hasResponseType = this.options.responseType === responseType;
                }
                return hasResponseType;
            }
            isAuthorizationCodeFlow() {
                return this.hasResponseType('code');
            }
            async invokeApiMethod(options) {
                if (!options.accessToken) {
                    const accessToken = (await this.tokenManager.getTokens()).accessToken;
                    options.accessToken = accessToken === null || accessToken === void 0 ? void 0 : accessToken.accessToken;
                }
                return httpRequest(this, options);
            }
            async revokeAccessToken(accessToken) {
                if (!accessToken) {
                    accessToken = (await this.tokenManager.getTokens()).accessToken;
                    const accessTokenKey = this.tokenManager.getStorageKeyByType('accessToken');
                    this.tokenManager.remove(accessTokenKey);
                }
                if (!accessToken) {
                    return Promise.resolve(null);
                }
                return this.token.revoke(accessToken);
            }
            async revokeRefreshToken(refreshToken) {
                if (!refreshToken) {
                    refreshToken = (await this.tokenManager.getTokens()).refreshToken;
                    const refreshTokenKey = this.tokenManager.getStorageKeyByType('refreshToken');
                    this.tokenManager.remove(refreshTokenKey);
                }
                if (!refreshToken) {
                    return Promise.resolve(null);
                }
                return this.token.revoke(refreshToken);
            }
            getSignOutRedirectUrl(options = {}) {
                let { idToken, postLogoutRedirectUri, state, } = options;
                if (!idToken) {
                    idToken = this.tokenManager.getTokensSync().idToken;
                }
                if (!idToken) {
                    return '';
                }
                if (!postLogoutRedirectUri) {
                    postLogoutRedirectUri = this.options.postLogoutRedirectUri;
                }
                const logoutUrl = getOAuthUrls(this).logoutUrl;
                const idTokenHint = idToken.idToken;
                let logoutUri = logoutUrl + '?id_token_hint=' + encodeURIComponent(idTokenHint);
                if (postLogoutRedirectUri) {
                    logoutUri += '&post_logout_redirect_uri=' + encodeURIComponent(postLogoutRedirectUri);
                }
                if (state) {
                    logoutUri += '&state=' + encodeURIComponent(state);
                }
                return logoutUri;
            }
            async signOut(options) {
                options = Object.assign({}, options);
                var defaultUri = window.location.origin;
                var currentUri = window.location.href;
                var postLogoutRedirectUri = options.postLogoutRedirectUri
                    || this.options.postLogoutRedirectUri
                    || defaultUri;
                var accessToken = options.accessToken;
                var refreshToken = options.refreshToken;
                var revokeAccessToken = options.revokeAccessToken !== false;
                var revokeRefreshToken = options.revokeRefreshToken !== false;
                if (revokeRefreshToken && typeof refreshToken === 'undefined') {
                    refreshToken = this.tokenManager.getTokensSync().refreshToken;
                }
                if (revokeAccessToken && typeof accessToken === 'undefined') {
                    accessToken = this.tokenManager.getTokensSync().accessToken;
                }
                if (!options.idToken) {
                    options.idToken = this.tokenManager.getTokensSync().idToken;
                }
                if (revokeRefreshToken && refreshToken) {
                    await this.revokeRefreshToken(refreshToken);
                }
                if (revokeAccessToken && accessToken) {
                    await this.revokeAccessToken(accessToken);
                }
                const logoutUri = this.getSignOutRedirectUrl(Object.assign(Object.assign({}, options), { postLogoutRedirectUri }));
                if (!logoutUri) {
                    return this.closeSession()
                        .then(function (sessionClosed) {
                        if (postLogoutRedirectUri === currentUri) {
                            window.location.reload();
                        }
                        else {
                            window.location.assign(postLogoutRedirectUri);
                        }
                        return sessionClosed;
                    });
                }
                else {
                    if (options.clearTokensBeforeRedirect) {
                        this.tokenManager.clear();
                    }
                    else {
                        this.tokenManager.addPendingRemoveFlags();
                    }
                    window.location.assign(logoutUri);
                    return true;
                }
            }
        },
        _a.crypto = index,
        _a;
}

export { mixinOAuth };
//# sourceMappingURL=index.js.map
