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
import { Remediator, RemediationValues } from './Base/Remediator';
import { NextStep, OktaAuthIdxInterface } from '../types';
import { IdxContext } from '../types/idx-js';
export interface EnrollPollValues extends RemediationValues {
    startPolling?: boolean;
}
export declare class EnrollPoll extends Remediator<EnrollPollValues> {
    static remediationName: string;
    canRemediate(): boolean;
    getNextStep(authClient: OktaAuthIdxInterface, context?: IdxContext): NextStep;
    getValuesAfterProceed(): EnrollPollValues;
}
