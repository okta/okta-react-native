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

import { parseIdxResponse } from './idxResponseParser.js';

function makeIdxState(authClient, idxResponse, toPersist, requestDidSucceed) {
    var _a, _b, _c;
    const rawIdxResponse = idxResponse;
    const { remediations, context, actions } = parseIdxResponse(authClient, idxResponse, toPersist);
    const neededToProceed = [...remediations];
    const proceed = async function (remediationChoice, paramsFromUser = {}) {
        const remediationChoiceObject = remediations.find((remediation) => remediation.name === remediationChoice);
        if (!remediationChoiceObject) {
            return Promise.reject(`Unknown remediation choice: [${remediationChoice}]`);
        }
        const actionFn = remediationChoiceObject.action;
        if (typeof actionFn !== 'function') {
            return Promise.reject(`Current remediation cannot make form submit action: [${remediationChoice}]`);
        }
        return remediationChoiceObject.action(paramsFromUser);
    };
    const findCode = item => item.name === 'interaction_code';
    const interactionCode = (_c = (_b = (_a = rawIdxResponse.successWithInteractionCode) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(findCode)) === null || _c === void 0 ? void 0 : _c.value;
    return {
        proceed,
        neededToProceed,
        actions,
        context,
        rawIdxState: rawIdxResponse,
        interactionCode,
        toPersist,
        requestDidSucceed,
    };
}

export { makeIdxState };
//# sourceMappingURL=makeIdxState.js.map
