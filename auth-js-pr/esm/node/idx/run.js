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

import { interact } from './interact.js';
import { introspect } from './introspect.js';
import { remediate } from './remediate.js';
import { IdxStatus } from './types/api.js';
import './remediators/EnrollAuthenticator.js';
import './remediators/EnrollPoll.js';
import './remediators/SelectEnrollmentChannel.js';
import './remediators/EnrollmentChannelData.js';
import './remediators/ChallengeAuthenticator.js';
import './remediators/ChallengePoll.js';
import './remediators/ResetAuthenticator.js';
import './remediators/EnrollProfile.js';
import './remediators/Identify.js';
import './remediators/ReEnrollAuthenticator.js';
import './remediators/RedirectIdp.js';
import './remediators/SelectAuthenticatorAuthenticate.js';
import './remediators/SelectAuthenticatorEnroll.js';
import './remediators/SelectAuthenticatorUnlockAccount.js';
import './remediators/SelectEnrollProfile.js';
import './remediators/AuthenticatorVerificationData.js';
import './remediators/AuthenticatorEnrollmentData.js';
import './remediators/Skip.js';
import { getFlowSpecification } from './flow/FlowSpecification.js';
import { saveTransactionMeta, getSavedTransactionMeta } from './transactionMeta.js';
import { getEnabledFeatures, getAvailableSteps, getMessagesFromResponse, isTerminalResponse } from './util.js';

function initializeValues(options) {
    const knownOptions = [
        'flow',
        'remediators',
        'actions',
        'withCredentials',
        'step',
        'useGenericRemediator',
        'exchangeCodeForTokens',
    ];
    const values = Object.assign({}, options);
    knownOptions.forEach(option => {
        delete values[option];
    });
    return values;
}
function initializeData(authClient, data) {
    let { options } = data;
    options = Object.assign(Object.assign({}, authClient.options.idx), options);
    let { flow, withCredentials, remediators, actions, } = options;
    const status = IdxStatus.PENDING;
    flow = flow || authClient.idx.getFlow() || 'default';
    if (flow) {
        authClient.idx.setFlow(flow);
        const flowSpec = getFlowSpecification(authClient, flow);
        withCredentials = (typeof withCredentials !== 'undefined') ? withCredentials : flowSpec.withCredentials;
        remediators = remediators || flowSpec.remediators;
        actions = actions || flowSpec.actions;
    }
    return Object.assign(Object.assign({}, data), { options: Object.assign(Object.assign({}, options), { flow,
            withCredentials,
            remediators,
            actions }), status });
}
async function getDataFromIntrospect(authClient, data) {
    const { options } = data;
    const { stateHandle, withCredentials, version, state, scopes, recoveryToken, activationToken, maxAge, acrValues, nonce, } = options;
    let idxResponse;
    let meta = getSavedTransactionMeta(authClient, { state, recoveryToken, activationToken });
    if (stateHandle) {
        idxResponse = await introspect(authClient, { withCredentials, version, stateHandle });
    }
    else {
        let interactionHandle = meta === null || meta === void 0 ? void 0 : meta.interactionHandle;
        if (!interactionHandle) {
            authClient.transactionManager.clear();
            const interactResponse = await interact(authClient, {
                withCredentials,
                state,
                scopes,
                activationToken,
                recoveryToken,
                maxAge,
                acrValues,
                nonce,
            });
            interactionHandle = interactResponse.interactionHandle;
            meta = interactResponse.meta;
        }
        idxResponse = await introspect(authClient, { withCredentials, version, interactionHandle });
    }
    return Object.assign(Object.assign({}, data), { idxResponse, meta });
}
async function getDataFromRemediate(authClient, data) {
    let { idxResponse, options, values } = data;
    const { autoRemediate, remediators, actions, flow, step, useGenericRemediator, } = options;
    const shouldRemediate = (autoRemediate !== false && (remediators || actions || step));
    if (!shouldRemediate) {
        return data;
    }
    values = Object.assign(Object.assign({}, values), { stateHandle: idxResponse.rawIdxState.stateHandle });
    const { idxResponse: idxResponseFromRemediation, nextStep, canceled, } = await remediate(authClient, idxResponse, values, {
        remediators,
        actions,
        flow,
        step,
        useGenericRemediator,
    });
    idxResponse = idxResponseFromRemediation;
    return Object.assign(Object.assign({}, data), { idxResponse, nextStep, canceled });
}
async function getTokens(authClient, data) {
    let { meta, idxResponse } = data;
    const { interactionCode } = idxResponse;
    const { clientId, codeVerifier, ignoreSignature, redirectUri, urls, scopes, } = meta;
    const tokenResponse = await authClient.token.exchangeCodeForTokens({
        interactionCode,
        clientId,
        codeVerifier,
        ignoreSignature,
        redirectUri,
        scopes
    }, urls);
    return tokenResponse.tokens;
}
async function finalizeData(authClient, data) {
    let { options, idxResponse, canceled, status, } = data;
    const { exchangeCodeForTokens } = options;
    let shouldSaveResponse = false;
    let shouldClearTransaction = false;
    let clearSharedStorage = true;
    let interactionCode;
    let tokens;
    let enabledFeatures;
    let availableSteps;
    let messages;
    let terminal;
    if (idxResponse) {
        shouldSaveResponse = !!(idxResponse.requestDidSucceed || idxResponse.stepUp);
        enabledFeatures = getEnabledFeatures(idxResponse);
        availableSteps = getAvailableSteps(authClient, idxResponse, options.useGenericRemediator);
        messages = getMessagesFromResponse(idxResponse, options);
        terminal = isTerminalResponse(idxResponse);
    }
    if (terminal) {
        status = IdxStatus.TERMINAL;
        const hasActions = Object.keys(idxResponse.actions).length > 0;
        const hasErrors = !!messages.find(msg => msg.class === 'ERROR');
        const isTerminalSuccess = !hasActions && !hasErrors && idxResponse.requestDidSucceed === true;
        if (isTerminalSuccess) {
            shouldClearTransaction = true;
        }
        else {
            shouldSaveResponse = !!hasActions;
        }
        clearSharedStorage = false;
    }
    else if (canceled) {
        status = IdxStatus.CANCELED;
        shouldClearTransaction = true;
    }
    else if (idxResponse === null || idxResponse === void 0 ? void 0 : idxResponse.interactionCode) {
        interactionCode = idxResponse.interactionCode;
        if (exchangeCodeForTokens === false) {
            status = IdxStatus.SUCCESS;
            shouldClearTransaction = false;
        }
        else {
            tokens = await getTokens(authClient, data);
            status = IdxStatus.SUCCESS;
            shouldClearTransaction = true;
        }
    }
    return Object.assign(Object.assign({}, data), { status,
        interactionCode,
        tokens,
        shouldSaveResponse,
        shouldClearTransaction,
        clearSharedStorage,
        enabledFeatures,
        availableSteps,
        messages,
        terminal });
}
async function run(authClient, options = {}) {
    var _a;
    let data = {
        options,
        values: initializeValues(options)
    };
    data = initializeData(authClient, data);
    data = await getDataFromIntrospect(authClient, data);
    data = await getDataFromRemediate(authClient, data);
    data = await finalizeData(authClient, data);
    const { idxResponse, meta, shouldSaveResponse, shouldClearTransaction, clearSharedStorage, status, enabledFeatures, availableSteps, tokens, nextStep, messages, error, interactionCode } = data;
    if (shouldClearTransaction) {
        authClient.transactionManager.clear({ clearSharedStorage });
    }
    else {
        saveTransactionMeta(authClient, Object.assign({}, meta));
        if (shouldSaveResponse) {
            const { rawIdxState: rawIdxResponse, requestDidSucceed } = idxResponse;
            authClient.transactionManager.saveIdxResponse({
                rawIdxResponse,
                requestDidSucceed,
                stateHandle: (_a = idxResponse.context) === null || _a === void 0 ? void 0 : _a.stateHandle,
                interactionHandle: meta === null || meta === void 0 ? void 0 : meta.interactionHandle
            });
        }
    }
    const { actions, context, neededToProceed, proceed, rawIdxState, requestDidSucceed, stepUp } = idxResponse || {};
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ status: status }, (meta && { meta })), (enabledFeatures && { enabledFeatures })), (availableSteps && { availableSteps })), (tokens && { tokens })), (nextStep && { nextStep })), (messages && messages.length && { messages })), (error && { error })), (stepUp && { stepUp })), { interactionCode,
        actions: actions, context: context, neededToProceed: neededToProceed, proceed: proceed, rawIdxState: rawIdxState, requestDidSucceed });
}

export { run };
//# sourceMappingURL=run.js.map
