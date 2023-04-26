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
import { Remediator, RemediationValues } from './Remediator';
import { Authenticator, AuthenticatorValues } from '../../authenticator';
import { IdxRemediation, IdxContext } from '../../types/idx-js';
import { OktaAuthIdxInterface, NextStep } from '../../types';
export declare type VerifyAuthenticatorValues = AuthenticatorValues & RemediationValues;
export declare class VerifyAuthenticator<T extends VerifyAuthenticatorValues = VerifyAuthenticatorValues> extends Remediator<T> {
    authenticator: Authenticator<VerifyAuthenticatorValues>;
    constructor(remediation: IdxRemediation, values?: T);
    getNextStep(authClient: OktaAuthIdxInterface, context?: IdxContext): NextStep;
    canRemediate(): boolean;
    mapCredentials(): import("../../authenticator").Credentials | undefined;
    getInputCredentials(input: any): any;
    getValuesAfterProceed(): T;
}
