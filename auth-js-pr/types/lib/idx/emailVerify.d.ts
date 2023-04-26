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
import { OktaAuthIdxInterface } from './types';
import CustomError from '../errors/CustomError';
import { EmailVerifyCallbackResponse } from './types/api';
export declare class EmailVerifyCallbackError extends CustomError {
    state: string;
    otp: string;
    constructor(state: string, otp: string);
}
export declare function isEmailVerifyCallbackError(error: Error): boolean;
export declare function isEmailVerifyCallback(urlPath: string): boolean;
export declare function parseEmailVerifyCallback(urlPath: string): EmailVerifyCallbackResponse;
export declare function handleEmailVerifyCallback(authClient: OktaAuthIdxInterface, search: string): Promise<import("./types").IdxTransaction | undefined>;
