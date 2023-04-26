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
import { OktaAuthStorageOptions } from '../storage/types';
import { AuthnTransactionAPI } from './types';
import { OktaAuthBaseInterface } from '../base/types';
export declare function transactionStatus(sdk: OktaAuthHttpInterface, args: any): Promise<any>;
export declare function resumeTransaction(sdk: OktaAuthHttpInterface, tx: AuthnTransactionAPI, args: any): Promise<import("./types").AuthnTransaction>;
export declare function introspectAuthn(sdk: OktaAuthHttpInterface, tx: AuthnTransactionAPI, args: any): Promise<import("./types").AuthnTransaction>;
export declare function transactionStep(sdk: OktaAuthHttpInterface, args: any): Promise<any>;
export declare function transactionExists(sdk: OktaAuthBaseInterface<OktaAuthStorageOptions>): boolean;
export declare function postToTransaction(sdk: OktaAuthHttpInterface, tx: AuthnTransactionAPI, url: string, args: any, options?: any): Promise<import("./types").AuthnTransaction>;
export declare function getSavedStateToken(sdk: OktaAuthBaseInterface<OktaAuthStorageOptions>): string;
