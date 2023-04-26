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
import { ServiceManagerOptions, ServiceInterface } from '../core/types';
import { Token, Tokens, TokenManagerInterface } from '../oidc/types';
export declare type SyncMessage = {
    type: string;
    key?: string;
    token?: Token;
    oldToken?: Token;
    storage?: Tokens;
};
export declare class SyncStorageService implements ServiceInterface {
    private tokenManager;
    private options;
    private channel?;
    private started;
    private enablePostMessage;
    constructor(tokenManager: TokenManagerInterface, options?: ServiceManagerOptions);
    requiresLeadership(): boolean;
    isStarted(): boolean;
    canStart(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    private onTokenAddedHandler;
    private onTokenRemovedHandler;
    private onTokenRenewedHandler;
    private onSetStorageHandler;
    private onSyncMessageHandler;
}
