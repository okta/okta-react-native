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
 *
 */
import { OktaAuthHttpInterface } from '../http/types';
import { AuthnTransactionFunction, AuthnTransaction, AuthnTransactionAPI, AuthnTransactionState } from './types';
export declare class AuthnTransactionImpl implements AuthnTransaction {
    next?: AuthnTransactionFunction;
    cancel?: AuthnTransactionFunction;
    skip?: AuthnTransactionFunction;
    unlock?: AuthnTransactionFunction;
    changePassword?: AuthnTransactionFunction;
    resetPassword?: AuthnTransactionFunction;
    answer?: AuthnTransactionFunction;
    recovery?: AuthnTransactionFunction;
    verify?: AuthnTransactionFunction;
    resend?: AuthnTransactionFunction;
    activate?: AuthnTransactionFunction;
    poll?: AuthnTransactionFunction;
    prev?: AuthnTransactionFunction;
    data?: AuthnTransactionState;
    stateToken?: string;
    sessionToken?: string;
    status: string;
    user?: Record<string, any>;
    factor?: Record<string, any>;
    factors?: Array<Record<string, any>>;
    policy?: Record<string, any>;
    scopes?: Array<Record<string, any>>;
    target?: Record<string, any>;
    authentication?: Record<string, any>;
    constructor(sdk: OktaAuthHttpInterface, tx: AuthnTransactionAPI, res?: AuthnTransactionState | null);
}
