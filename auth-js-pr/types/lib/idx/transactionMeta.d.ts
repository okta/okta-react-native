/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
import { OktaAuthIdxInterface, IdxTransactionMeta, IdxTransactionMetaOptions } from './types';
export declare function createTransactionMeta(authClient: OktaAuthIdxInterface, options?: IdxTransactionMetaOptions): Promise<IdxTransactionMeta>;
export declare function hasSavedInteractionHandle(authClient: OktaAuthIdxInterface, options?: IdxTransactionMetaOptions): boolean;
export declare function getSavedTransactionMeta(authClient: OktaAuthIdxInterface, options?: IdxTransactionMetaOptions): IdxTransactionMeta | undefined;
export declare function getTransactionMeta(authClient: OktaAuthIdxInterface, options?: IdxTransactionMetaOptions): Promise<IdxTransactionMeta>;
export declare function saveTransactionMeta(authClient: OktaAuthIdxInterface, meta: any): void;
export declare function clearTransactionMeta(authClient: OktaAuthIdxInterface): void;
export declare function isTransactionMetaValid(meta: any, options?: IdxTransactionMetaOptions): boolean;
export declare function isTransactionMetaValidForFlow(meta: any, flow: any): boolean;
export declare function isTransactionMetaValidForOptions(meta: any, options: any, keys: any): boolean;
