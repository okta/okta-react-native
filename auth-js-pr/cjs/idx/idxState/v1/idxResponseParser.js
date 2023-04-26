"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.parseNonRemediations = exports.parseIdxResponse = void 0;
var _remediationParser = require("./remediationParser");
var _generateIdxAction = _interopRequireDefault(require("./generateIdxAction"));
var _jsonpath = require("../../../util/jsonpath");
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

/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// auth-js/types

const SKIP_FIELDS = Object.fromEntries(['remediation',
// remediations are put into proceed/neededToProceed
'context' // the API response of 'context' isn't externally useful.  We ignore it and put all non-action (contextual) info into idxState.context
].map(field => [field, !!'skip this field']));
const parseNonRemediations = function parseNonRemediations(authClient, idxResponse, toPersist = {}) {
  const actions = {};
  const context = {};
  Object.keys(idxResponse).filter(field => !SKIP_FIELDS[field]).forEach(field => {
    const fieldIsObject = typeof idxResponse[field] === 'object' && !!idxResponse[field];
    if (!fieldIsObject) {
      // simple fields are contextual info
      context[field] = idxResponse[field];
      return;
    }
    if (idxResponse[field].rel) {
      // top level actions
      actions[idxResponse[field].name] = (0, _generateIdxAction.default)(authClient, idxResponse[field], toPersist);
      return;
    }
    const {
      value: fieldValue,
      type,
      ...info
    } = idxResponse[field];
    context[field] = {
      type,
      ...info
    }; // add the non-action parts as context

    if (type !== 'object') {
      // only object values hold actions
      context[field].value = fieldValue;
      return;
    }

    // We are an object field containing an object value
    context[field].value = {};
    Object.entries(fieldValue).forEach(([subField, value]) => {
      if (value.rel) {
        // is [field].value[subField] an action?
        // add any "action" value subfields to actions
        actions[`${field}-${subField.name || subField}`] = (0, _generateIdxAction.default)(authClient, value, toPersist);
      } else {
        // add non-action value subfields to context
        context[field].value[subField] = value;
      }
    });
  });
  return {
    context,
    actions
  };
};
exports.parseNonRemediations = parseNonRemediations;
const expandRelatesTo = (idxResponse, value) => {
  Object.keys(value).forEach(k => {
    if (k === 'relatesTo') {
      const query = Array.isArray(value[k]) ? value[k][0] : value[k];
      if (typeof query === 'string') {
        const result = (0, _jsonpath.jsonpath)({
          path: query,
          json: idxResponse
        })[0];
        if (result) {
          value[k] = result;
          return;
        }
      }
    }
    if (Array.isArray(value[k])) {
      value[k].forEach(innerValue => expandRelatesTo(idxResponse, innerValue));
    }
  });
};
const convertRemediationAction = (authClient, remediation, toPersist) => {
  // Only remediation that has `rel` field (indicator for form submission) can have http action
  if (remediation.rel) {
    const remediationActions = (0, _remediationParser.generateRemediationFunctions)(authClient, [remediation], toPersist);
    const actionFn = remediationActions[remediation.name];
    return {
      ...remediation,
      action: actionFn
    };
  }
  return remediation;
};
const parseIdxResponse = function parseIdxResponse(authClient, idxResponse, toPersist = {}) {
  var _idxResponse$remediat;
  const remediationData = ((_idxResponse$remediat = idxResponse.remediation) === null || _idxResponse$remediat === void 0 ? void 0 : _idxResponse$remediat.value) || [];
  remediationData.forEach(remediation => expandRelatesTo(idxResponse, remediation));
  const remediations = remediationData.map(remediation => convertRemediationAction(authClient, remediation, toPersist));
  const {
    context,
    actions
  } = parseNonRemediations(authClient, idxResponse, toPersist);
  return {
    remediations,
    context,
    actions
  };
};
exports.parseIdxResponse = parseIdxResponse;
//# sourceMappingURL=idxResponseParser.js.map