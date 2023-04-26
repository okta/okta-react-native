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
import { OAuthResponseMode, OAuthResponseType, OktaAuthOAuthInterface, SetLocationFunction, TokenManagerOptions, TransactionManagerOptions } from '../types';
export declare function createOAuthOptionsConstructor(): {
    new (options: any): {
        issuer: string;
        authorizeUrl: string;
        userinfoUrl: string;
        tokenUrl: string;
        revokeUrl: string;
        logoutUrl: string;
        pkce: boolean;
        clientId: string;
        redirectUri: string;
        responseType: OAuthResponseType | OAuthResponseType[];
        responseMode: OAuthResponseMode;
        state: string;
        scopes: string[];
        ignoreSignature: boolean;
        codeChallenge: string;
        codeChallengeMethod: string;
        acrValues: string;
        maxAge: string | number;
        tokenManager: TokenManagerOptions;
        postLogoutRedirectUri: string;
        restoreOriginalUri: (oktaAuth: OktaAuthOAuthInterface, originalUri?: string) => Promise<void>;
        transactionManager: TransactionManagerOptions;
        clientSecret: string;
        setLocation: SetLocationFunction;
        ignoreLifetime: boolean;
        maxClockSkew: number;
        transformErrorXHR: (xhr: object) => any;
        headers: object;
        httpRequestClient: import("../../http").HttpRequestClient;
        httpRequestInterceptors: ((request: import("../../http").RequestOptions) => void)[];
        cookies: import("../../storage").CookieOptions;
        storageUtil: import("../../storage").StorageUtil;
        storageManager: import("../../storage").StorageManagerOptions;
        devMode: boolean;
    };
};
