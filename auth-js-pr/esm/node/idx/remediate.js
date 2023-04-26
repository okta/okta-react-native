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

import AuthSdkError from '../errors/AuthSdkError.js';
import { getRemediator, handleFailedResponse, isTerminalResponse, filterValuesForRemediation, getNextStep } from './util.js';

function getActionFromValues(values, idxResponse) {
    return Object.keys(idxResponse.actions).find(action => !!values.resend && action.includes('-resend'));
}
function removeActionFromValues(values) {
    return Object.assign(Object.assign({}, values), { resend: undefined });
}
function removeActionFromOptions(options, actionName) {
    let actions = options.actions || [];
    actions = actions.filter(entry => {
        if (typeof entry === 'string') {
            return entry !== actionName;
        }
        return entry.name !== actionName;
    });
    return Object.assign(Object.assign({}, options), { actions });
}
async function remediate(authClient, idxResponse, values, options) {
    let { neededToProceed, interactionCode } = idxResponse;
    const { flow } = options;
    if (interactionCode) {
        return { idxResponse };
    }
    const remediator = getRemediator(neededToProceed, values, options);
    const actionFromValues = getActionFromValues(values, idxResponse);
    const actionFromOptions = options.actions || [];
    const actions = [
        ...actionFromOptions,
        ...(actionFromValues && [actionFromValues] || []),
    ];
    if (actions) {
        for (let action of actions) {
            let params = {};
            if (typeof action !== 'string') {
                params = action.params || {};
                action = action.name;
            }
            let valuesWithoutExecutedAction = removeActionFromValues(values);
            let optionsWithoutExecutedAction = removeActionFromOptions(options, action);
            if (typeof idxResponse.actions[action] === 'function') {
                idxResponse = await idxResponse.actions[action](params);
                if (idxResponse.requestDidSucceed === false) {
                    return handleFailedResponse(authClient, idxResponse, options);
                }
                if (action === 'cancel') {
                    return { idxResponse, canceled: true };
                }
                return remediate(authClient, idxResponse, valuesWithoutExecutedAction, optionsWithoutExecutedAction);
            }
            const remediationAction = neededToProceed.find(({ name }) => name === action);
            if (remediationAction) {
                idxResponse = await idxResponse.proceed(action, params);
                if (idxResponse.requestDidSucceed === false) {
                    return handleFailedResponse(authClient, idxResponse, options);
                }
                return remediate(authClient, idxResponse, values, optionsWithoutExecutedAction);
            }
        }
    }
    const terminal = isTerminalResponse(idxResponse);
    if (terminal) {
        return { idxResponse, terminal };
    }
    if (!remediator) {
        if (options.step) {
            values = filterValuesForRemediation(idxResponse, options.step, values);
            idxResponse = await idxResponse.proceed(options.step, values);
            if (idxResponse.requestDidSucceed === false) {
                return handleFailedResponse(authClient, idxResponse, options);
            }
            return { idxResponse };
        }
        if (flow === 'default') {
            return { idxResponse };
        }
        throw new AuthSdkError(`
      No remediation can match current flow, check policy settings in your org.
      Remediations: [${neededToProceed.reduce((acc, curr) => acc ? acc + ' ,' + curr.name : curr.name, '')}]
    `);
    }
    if (!remediator.canRemediate()) {
        const nextStep = getNextStep(authClient, remediator, idxResponse);
        return {
            idxResponse,
            nextStep,
        };
    }
    const name = remediator.getName();
    const data = remediator.getData();
    idxResponse = await idxResponse.proceed(name, data);
    if (idxResponse.requestDidSucceed === false) {
        return handleFailedResponse(authClient, idxResponse, options);
    }
    values = remediator.getValuesAfterProceed();
    options = Object.assign(Object.assign({}, options), { step: undefined });
    if (options.useGenericRemediator && !idxResponse.interactionCode && !isTerminalResponse(idxResponse)) {
        const gr = getRemediator(idxResponse.neededToProceed, values, options);
        const nextStep = getNextStep(authClient, gr, idxResponse);
        return {
            idxResponse,
            nextStep,
        };
    }
    return remediate(authClient, idxResponse, values, options);
}

export { remediate };
//# sourceMappingURL=remediate.js.map
