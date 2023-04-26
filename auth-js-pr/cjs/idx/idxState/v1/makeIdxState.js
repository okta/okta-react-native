"use strict";

exports.makeIdxState = makeIdxState;
var _idxResponseParser = require("./idxResponseParser");
/*!
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

// auth-js/types

function makeIdxState(authClient, idxResponse, toPersist, requestDidSucceed) {
  var _rawIdxResponse$succe, _rawIdxResponse$succe2, _rawIdxResponse$succe3;
  const rawIdxResponse = idxResponse;
  const {
    remediations,
    context,
    actions
  } = (0, _idxResponseParser.parseIdxResponse)(authClient, idxResponse, toPersist);
  const neededToProceed = [...remediations];
  const proceed = async function (remediationChoice, paramsFromUser = {}) {
    /*
    remediationChoice is the name attribute on each form
    name should remain unique for items inside the remediation that are considered forms(identify, select-factor)
    name can be duplicate for items like redirect where its not considered a form(redirect)
    when names are not unique its a redirect to a href, so widget wont POST to idx-js layer.
    */
    const remediationChoiceObject = remediations.find(remediation => remediation.name === remediationChoice);
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
  const interactionCode = (_rawIdxResponse$succe = rawIdxResponse.successWithInteractionCode) === null || _rawIdxResponse$succe === void 0 ? void 0 : (_rawIdxResponse$succe2 = _rawIdxResponse$succe.value) === null || _rawIdxResponse$succe2 === void 0 ? void 0 : (_rawIdxResponse$succe3 = _rawIdxResponse$succe2.find(findCode)) === null || _rawIdxResponse$succe3 === void 0 ? void 0 : _rawIdxResponse$succe3.value;
  return {
    proceed,
    neededToProceed,
    actions,
    context,
    rawIdxState: rawIdxResponse,
    interactionCode,
    toPersist,
    requestDidSucceed
  };
}
//# sourceMappingURL=makeIdxState.js.map