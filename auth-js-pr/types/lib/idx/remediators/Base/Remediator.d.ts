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
import { OktaAuthIdxInterface, NextStep, IdxMessage, Authenticator, Input, RemediateOptions } from '../../types';
import { IdxAuthenticator, IdxRemediation, IdxContext } from '../../types/idx-js';
export declare type IdxToRemediationValueMap = Record<string, string[]>;
export interface RemediationValues {
    stateHandle?: string;
    authenticators?: (Authenticator | string)[];
    authenticator?: string | Authenticator;
    authenticatorsData?: Authenticator[];
    resend?: boolean;
}
export interface RemediatorConstructor {
    new <T extends RemediationValues>(remediation: IdxRemediation, values?: T, options?: RemediateOptions): any;
}
export declare class Remediator<T extends RemediationValues = RemediationValues> {
    static remediationName: string;
    remediation: IdxRemediation;
    values: T;
    options: RemediateOptions;
    map?: IdxToRemediationValueMap;
    constructor(remediation: IdxRemediation, values?: T, options?: RemediateOptions);
    private formatAuthenticators;
    getName(): string;
    canRemediate(): boolean;
    getData(key?: string): any;
    hasData(key: string): boolean;
    getNextStep(_authClient: OktaAuthIdxInterface, _context?: IdxContext): NextStep;
    getInputs(): Input[];
    static getMessages(remediation: IdxRemediation): IdxMessage[] | undefined;
    getValuesAfterProceed(): T;
    protected getAuthenticator(): IdxAuthenticator | undefined;
}
