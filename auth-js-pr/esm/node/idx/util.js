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

import { __rest } from '../_virtual/_tslib.js';
import { warn } from '../util/console.js';
import { split2 } from '../util/misc.js';
import * as index from './remediators/index.js';
import { GenericRemediator } from './remediators/GenericRemediator/GenericRemediator.js';
import { IdxFeature } from './types/api.js';

function isTerminalResponse(idxResponse) {
    const { neededToProceed, interactionCode } = idxResponse;
    return !neededToProceed.length && !interactionCode;
}
function canSkipFn(idxResponse) {
    return idxResponse.neededToProceed.some(({ name }) => name === 'skip');
}
function canResendFn(idxResponse) {
    return Object.keys(idxResponse.actions).some(actionName => actionName.includes('resend'));
}
function getMessagesFromIdxRemediationValue(value) {
    if (!value || !Array.isArray(value)) {
        return;
    }
    return value.reduce((messages, value) => {
        if (value.messages) {
            messages = [...messages, ...value.messages.value];
        }
        if (value.form) {
            const messagesFromForm = getMessagesFromIdxRemediationValue(value.form.value) || [];
            messages = [...messages, ...messagesFromForm];
        }
        if (value.options) {
            let optionValues = [];
            value.options.forEach(option => {
                if (!option.value || typeof option.value === 'string') {
                    return;
                }
                optionValues = [...optionValues, option.value];
            });
            const messagesFromOptions = getMessagesFromIdxRemediationValue(optionValues) || [];
            messages = [...messages, ...messagesFromOptions];
        }
        return messages;
    }, []);
}
function getMessagesFromResponse(idxResponse, options) {
    var _a;
    let messages = [];
    const { rawIdxState, neededToProceed } = idxResponse;
    const globalMessages = (_a = rawIdxState.messages) === null || _a === void 0 ? void 0 : _a.value.map(message => message);
    if (globalMessages) {
        messages = [...messages, ...globalMessages];
    }
    if (!options.useGenericRemediator) {
        for (let remediation of neededToProceed) {
            const fieldMessages = getMessagesFromIdxRemediationValue(remediation.value);
            if (fieldMessages) {
                messages = [...messages, ...fieldMessages];
            }
        }
    }
    const seen = {};
    messages = messages.reduce((filtered, message) => {
        var _a;
        const key = (_a = message.i18n) === null || _a === void 0 ? void 0 : _a.key;
        if (key && seen[key]) {
            return filtered;
        }
        seen[key] = message;
        filtered = [...filtered, message];
        return filtered;
    }, []);
    return messages;
}
function getEnabledFeatures(idxResponse) {
    const res = [];
    const { actions, neededToProceed } = idxResponse;
    if (actions['currentAuthenticator-recover']) {
        res.push(IdxFeature.PASSWORD_RECOVERY);
    }
    if (neededToProceed.some(({ name }) => name === 'select-enroll-profile')) {
        res.push(IdxFeature.REGISTRATION);
    }
    if (neededToProceed.some(({ name }) => name === 'redirect-idp')) {
        res.push(IdxFeature.SOCIAL_IDP);
    }
    if (neededToProceed.some(({ name }) => name === 'unlock-account')) {
        res.push(IdxFeature.ACCOUNT_UNLOCK);
    }
    return res;
}
function getAvailableSteps(authClient, idxResponse, useGenericRemediator) {
    var _a;
    const res = [];
    const remediatorMap = Object.values(index)
        .reduce((map, remediatorClass) => {
        if (remediatorClass.remediationName) {
            map[remediatorClass.remediationName] = remediatorClass;
        }
        return map;
    }, {});
    for (let remediation of idxResponse.neededToProceed) {
        const T = getRemediatorClass(remediation, { useGenericRemediator, remediators: remediatorMap });
        if (T) {
            const remediator = new T(remediation);
            res.push(remediator.getNextStep(authClient, idxResponse.context));
        }
    }
    for (const [name] of Object.entries((idxResponse.actions || {}))) {
        let stepObj = {
            name,
            action: async (params) => {
                return authClient.idx.proceed({
                    actions: [{ name, params }]
                });
            }
        };
        if (name.startsWith('currentAuthenticator')) {
            const [part1, part2] = split2(name, '-');
            const actionObj = idxResponse.rawIdxState[part1].value[part2];
            const rest = __rest(actionObj, ["href", "method", "rel", "accepts", "produces"]);
            const value = (_a = actionObj.value) === null || _a === void 0 ? void 0 : _a.filter(item => item.name !== 'stateHandle');
            stepObj = Object.assign(Object.assign(Object.assign({}, rest), (value && { value })), stepObj);
        }
        res.push(stepObj);
    }
    return res;
}
function filterValuesForRemediation(idxResponse, remediationName, values) {
    const remediations = idxResponse.neededToProceed || [];
    const remediation = remediations.find(r => r.name === remediationName);
    if (!remediation) {
        warn(`filterValuesForRemediation: "${remediationName}" did not match any remediations`);
        return values;
    }
    const valuesForRemediation = remediation.value.reduce((res, entry) => {
        const { name, value } = entry;
        if (name === 'stateHandle') {
            res[name] = value;
        }
        else {
            res[name] = values[name];
        }
        return res;
    }, {});
    return valuesForRemediation;
}
function getRemediatorClass(remediation, options) {
    const { useGenericRemediator, remediators } = options;
    if (!remediation) {
        return undefined;
    }
    if (useGenericRemediator) {
        return GenericRemediator;
    }
    return remediators[remediation.name];
}
function getRemediator(idxRemediations, values, options) {
    const remediators = options.remediators;
    const useGenericRemediator = options.useGenericRemediator;
    let remediator;
    if (options.step) {
        const remediation = idxRemediations.find(({ name }) => name === options.step);
        if (remediation) {
            const T = getRemediatorClass(remediation, options);
            return T ? new T(remediation, values, options) : undefined;
        }
        else {
            warn(`step "${options.step}" did not match any remediations`);
            return;
        }
    }
    const remediatorCandidates = [];
    if (useGenericRemediator) {
        remediatorCandidates.push(new GenericRemediator(idxRemediations[0], values, options));
    }
    else {
        for (let remediation of idxRemediations) {
            const isRemeditionInFlow = Object.keys(remediators).includes(remediation.name);
            if (!isRemeditionInFlow) {
                continue;
            }
            const T = getRemediatorClass(remediation, options);
            remediator = new T(remediation, values, options);
            if (remediator.canRemediate()) {
                return remediator;
            }
            remediatorCandidates.push(remediator);
        }
    }
    return remediatorCandidates[0];
}
function getNextStep(authClient, remediator, idxResponse) {
    const nextStep = remediator.getNextStep(authClient, idxResponse.context);
    const canSkip = canSkipFn(idxResponse);
    const canResend = canResendFn(idxResponse);
    return Object.assign(Object.assign(Object.assign({}, nextStep), (canSkip && { canSkip })), (canResend && { canResend }));
}
function handleFailedResponse(authClient, idxResponse, options = {}) {
    const terminal = isTerminalResponse(idxResponse);
    const messages = getMessagesFromResponse(idxResponse, options);
    if (terminal) {
        return { idxResponse, terminal, messages };
    }
    else {
        const remediator = getRemediator(idxResponse.neededToProceed, {}, options);
        const nextStep = remediator && getNextStep(authClient, remediator, idxResponse);
        return Object.assign({ idxResponse,
            messages }, (nextStep && { nextStep }));
    }
}

export { canResendFn, canSkipFn, filterValuesForRemediation, getAvailableSteps, getEnabledFeatures, getMessagesFromIdxRemediationValue, getMessagesFromResponse, getNextStep, getRemediator, handleFailedResponse, isTerminalResponse };
//# sourceMappingURL=util.js.map
