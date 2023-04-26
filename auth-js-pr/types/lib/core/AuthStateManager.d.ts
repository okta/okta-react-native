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
import { OAuthStorageManagerInterface, OAuthTransactionMeta, OktaAuthOAuthInterface } from '../oidc';
import { AuthState, AuthStateLogOptions, OktaAuthCoreOptions } from './types';
import { PromiseQueue } from '../util';
export declare const INITIAL_AUTH_STATE: null;
export declare class AuthStateManager<M extends OAuthTransactionMeta, S extends OAuthStorageManagerInterface<M>, O extends OktaAuthCoreOptions> {
    _sdk: OktaAuthOAuthInterface<M, S, O>;
    _pending: {
        updateAuthStatePromise: any;
        canceledTimes: number;
    };
    _authState: AuthState | null;
    _prevAuthState: AuthState | null;
    _logOptions: AuthStateLogOptions;
    _transformQueue: PromiseQueue;
    constructor(sdk: OktaAuthOAuthInterface<M, S, O>);
    _setLogOptions(options: any): void;
    getAuthState(): AuthState | null;
    getPreviousAuthState(): AuthState | null;
    updateAuthState(): Promise<AuthState>;
    subscribe(handler: any): void;
    unsubscribe(handler?: any): void;
}
