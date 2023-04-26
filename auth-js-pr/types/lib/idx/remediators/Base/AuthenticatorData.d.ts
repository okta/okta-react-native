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
import { IdxRemediationValue, IdxRemediation, IdxAuthenticator } from '../../types/idx-js';
export declare type AuthenticatorDataValues = RemediationValues & {
    methodType?: string;
};
export declare class AuthenticatorData<T extends AuthenticatorDataValues = AuthenticatorDataValues> extends Remediator<T> {
    authenticator: IdxAuthenticator;
    constructor(remediation: IdxRemediation, values?: T);
    protected formatAuthenticatorData(): void;
    protected getAuthenticatorData(): import("../../types/api").Authenticator | undefined;
    canRemediate(): boolean;
    protected mapAuthenticatorDataFromValues(authenticatorData?: any): any;
    protected getAuthenticatorFromRemediation(): IdxRemediationValue;
    getValuesAfterProceed(): T;
}
