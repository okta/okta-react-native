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
import { IdxRemediationValue } from '../../types/idx-js';
import { Authenticator } from '../../types/api';
export declare type SelectAuthenticatorValues = RemediationValues & {
    authenticator?: string | Authenticator;
};
export declare class SelectAuthenticator<T extends SelectAuthenticatorValues = SelectAuthenticatorValues> extends Remediator<T> {
    selectedAuthenticator?: Authenticator;
    selectedOption?: any;
    findMatchedOption(authenticators: any, options: any): any;
    canRemediate(): boolean;
    mapAuthenticator(remediationValue: IdxRemediationValue): Authenticator | {
        id: any;
    };
    getInputAuthenticator(remediation: any): {
        name: string;
        type: string;
        options: any;
    };
    getValuesAfterProceed(): T;
}
