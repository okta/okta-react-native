"use strict";

exports.run = run;
var _interact = require("./interact");
var _introspect = require("./introspect");
var _remediate = require("./remediate");
var _flow = require("./flow");
var _types = require("./types");
var _transactionMeta = require("./transactionMeta");
var _util = require("./util");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

/* eslint-disable max-statements, complexity, max-depth */

function initializeValues(options) {
  // remove known options, everything else is assumed to be a value
  const knownOptions = ['flow', 'remediators', 'actions', 'withCredentials', 'step', 'useGenericRemediator', 'exchangeCodeForTokens'];
  const values = {
    ...options
  };
  knownOptions.forEach(option => {
    delete values[option];
  });
  return values;
}
function initializeData(authClient, data) {
  let {
    options
  } = data;
  options = {
    ...authClient.options.idx,
    ...options
  };
  let {
    flow,
    withCredentials,
    remediators,
    actions
  } = options;
  const status = _types.IdxStatus.PENDING;

  // certain options can be set by the flow specification
  flow = flow || authClient.idx.getFlow() || 'default';
  if (flow) {
    authClient.idx.setFlow(flow);
    const flowSpec = (0, _flow.getFlowSpecification)(authClient, flow);
    // Favor option values over flow spec
    withCredentials = typeof withCredentials !== 'undefined' ? withCredentials : flowSpec.withCredentials;
    remediators = remediators || flowSpec.remediators;
    actions = actions || flowSpec.actions;
  }
  return {
    ...data,
    options: {
      ...options,
      flow,
      withCredentials,
      remediators,
      actions
    },
    status
  };
}
async function getDataFromIntrospect(authClient, data) {
  const {
    options
  } = data;
  const {
    stateHandle,
    withCredentials,
    version,
    state,
    scopes,
    recoveryToken,
    activationToken,
    maxAge,
    acrValues,
    nonce
  } = options;
  let idxResponse;
  let meta = (0, _transactionMeta.getSavedTransactionMeta)(authClient, {
    state,
    recoveryToken,
    activationToken
  }); // may be undefined

  if (stateHandle) {
    idxResponse = await (0, _introspect.introspect)(authClient, {
      withCredentials,
      version,
      stateHandle
    });
  } else {
    var _meta;
    let interactionHandle = (_meta = meta) === null || _meta === void 0 ? void 0 : _meta.interactionHandle; // may be undefined
    if (!interactionHandle) {
      // start a new transaction
      authClient.transactionManager.clear();
      const interactResponse = await (0, _interact.interact)(authClient, {
        withCredentials,
        state,
        scopes,
        activationToken,
        recoveryToken,
        maxAge,
        acrValues,
        nonce
      });
      interactionHandle = interactResponse.interactionHandle;
      meta = interactResponse.meta;
    }

    // Introspect to get idx response
    idxResponse = await (0, _introspect.introspect)(authClient, {
      withCredentials,
      version,
      interactionHandle
    });
  }
  return {
    ...data,
    idxResponse,
    meta
  };
}
async function getDataFromRemediate(authClient, data) {
  let {
    idxResponse,
    options,
    values
  } = data;
  const {
    autoRemediate,
    remediators,
    actions,
    flow,
    step,
    useGenericRemediator
  } = options;
  const shouldRemediate = autoRemediate !== false && (remediators || actions || step);
  if (!shouldRemediate) {
    return data;
  }
  values = {
    ...values,
    stateHandle: idxResponse.rawIdxState.stateHandle
  };

  // Can we handle the remediations?
  const {
    idxResponse: idxResponseFromRemediation,
    nextStep,
    canceled
  } = await (0, _remediate.remediate)(authClient, idxResponse, values, {
    remediators,
    actions,
    flow,
    step,
    useGenericRemediator
  });
  idxResponse = idxResponseFromRemediation;
  return {
    ...data,
    idxResponse,
    nextStep,
    canceled
  };
}
async function getTokens(authClient, data) {
  let {
    meta,
    idxResponse
  } = data;
  const {
    interactionCode
  } = idxResponse;
  const {
    clientId,
    codeVerifier,
    ignoreSignature,
    redirectUri,
    urls,
    scopes
  } = meta;
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
  let {
    options,
    idxResponse,
    canceled,
    status
  } = data;
  const {
    exchangeCodeForTokens
  } = options;
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
    enabledFeatures = (0, _util.getEnabledFeatures)(idxResponse);
    availableSteps = (0, _util.getAvailableSteps)(authClient, idxResponse, options.useGenericRemediator);
    messages = (0, _util.getMessagesFromResponse)(idxResponse, options);
    terminal = (0, _util.isTerminalResponse)(idxResponse);
  }
  if (terminal) {
    status = _types.IdxStatus.TERMINAL;

    // In most cases a terminal response should not clear transaction data. The user should cancel or skip to continue.
    // A terminal "success" is a non-error response with no further actions available.
    // In these narrow cases, saved transaction data should be cleared.
    // One example of a terminal success is when the email verify flow is continued in another tab
    const hasActions = Object.keys(idxResponse.actions).length > 0;
    const hasErrors = !!messages.find(msg => msg.class === 'ERROR');
    const isTerminalSuccess = !hasActions && !hasErrors && idxResponse.requestDidSucceed === true;
    if (isTerminalSuccess) {
      shouldClearTransaction = true;
    } else {
      // save response if there are actions available (ignore messages)
      shouldSaveResponse = !!hasActions;
    }
    // leave shared storage intact so the transaction can be continued in another tab
    clearSharedStorage = false;
  } else if (canceled) {
    status = _types.IdxStatus.CANCELED;
    shouldClearTransaction = true;
  } else if (idxResponse !== null && idxResponse !== void 0 && idxResponse.interactionCode) {
    interactionCode = idxResponse.interactionCode;
    if (exchangeCodeForTokens === false) {
      status = _types.IdxStatus.SUCCESS;
      shouldClearTransaction = false;
    } else {
      tokens = await getTokens(authClient, data);
      status = _types.IdxStatus.SUCCESS;
      shouldClearTransaction = true;
    }
  }
  return {
    ...data,
    status,
    interactionCode,
    tokens,
    shouldSaveResponse,
    shouldClearTransaction,
    clearSharedStorage,
    enabledFeatures,
    availableSteps,
    messages,
    terminal
  };
}
async function run(authClient, options = {}) {
  let data = {
    options,
    values: initializeValues(options)
  };
  data = initializeData(authClient, data);
  data = await getDataFromIntrospect(authClient, data);
  data = await getDataFromRemediate(authClient, data);
  data = await finalizeData(authClient, data);
  const {
    idxResponse,
    meta,
    shouldSaveResponse,
    shouldClearTransaction,
    clearSharedStorage,
    status,
    enabledFeatures,
    availableSteps,
    tokens,
    nextStep,
    messages,
    error,
    interactionCode
  } = data;
  if (shouldClearTransaction) {
    authClient.transactionManager.clear({
      clearSharedStorage
    });
  } else {
    // ensures state is saved to sessionStorage
    (0, _transactionMeta.saveTransactionMeta)(authClient, {
      ...meta
    });
    if (shouldSaveResponse) {
      var _context;
      // Save intermediate idx response in storage to reduce introspect call
      const {
        rawIdxState: rawIdxResponse,
        requestDidSucceed
      } = idxResponse;
      authClient.transactionManager.saveIdxResponse({
        rawIdxResponse,
        requestDidSucceed,
        stateHandle: (_context = idxResponse.context) === null || _context === void 0 ? void 0 : _context.stateHandle,
        interactionHandle: meta === null || meta === void 0 ? void 0 : meta.interactionHandle
      });
    }
  }

  // copy all fields from idxResponse which are needed by the widget
  const {
    actions,
    context,
    neededToProceed,
    proceed,
    rawIdxState,
    requestDidSucceed,
    stepUp
  } = idxResponse || {};
  return {
    status: status,
    ...(meta && {
      meta
    }),
    ...(enabledFeatures && {
      enabledFeatures
    }),
    ...(availableSteps && {
      availableSteps
    }),
    ...(tokens && {
      tokens
    }),
    ...(nextStep && {
      nextStep
    }),
    ...(messages && messages.length && {
      messages
    }),
    ...(error && {
      error
    }),
    ...(stepUp && {
      stepUp
    }),
    interactionCode,
    // if options.exchangeCodeForTokens is false

    // from idx-js
    actions: actions,
    context: context,
    neededToProceed: neededToProceed,
    proceed: proceed,
    rawIdxState: rawIdxState,
    requestDidSucceed
  };
}
//# sourceMappingURL=run.js.map