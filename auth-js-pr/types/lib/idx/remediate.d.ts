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
import { RemediationValues } from './remediators';
import { OktaAuthIdxInterface, RemediateOptions, RemediationResponse } from './types';
import { IdxResponse, IdxActionParams } from './types/idx-js';
export interface RemediateActionWithOptionalParams {
    name: string;
    params?: IdxActionParams;
}
export declare type RemediateAction = string | RemediateActionWithOptionalParams;
export declare function remediate(authClient: OktaAuthIdxInterface, idxResponse: IdxResponse, values: RemediationValues, options: RemediateOptions): Promise<RemediationResponse>;
