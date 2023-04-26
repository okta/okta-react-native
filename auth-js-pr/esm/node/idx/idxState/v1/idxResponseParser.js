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

import { __rest } from '../../../_virtual/_tslib.js';
import { generateRemediationFunctions } from './remediationParser.js';
import generateIdxAction from './generateIdxAction.js';
import { jsonpath } from '../../../util/jsonpath.js';

const SKIP_FIELDS = Object.fromEntries([
    'remediation',
    'context',
].map((field) => [field, !!'skip this field']));
const parseNonRemediations = function parseNonRemediations(authClient, idxResponse, toPersist = {}) {
    const actions = {};
    const context = {};
    Object.keys(idxResponse)
        .filter(field => !SKIP_FIELDS[field])
        .forEach(field => {
        const fieldIsObject = typeof idxResponse[field] === 'object' && !!idxResponse[field];
        if (!fieldIsObject) {
            context[field] = idxResponse[field];
            return;
        }
        if (idxResponse[field].rel) {
            actions[idxResponse[field].name] = generateIdxAction(authClient, idxResponse[field], toPersist);
            return;
        }
        const _a = idxResponse[field], { value: fieldValue, type } = _a, info = __rest(_a, ["value", "type"]);
        context[field] = Object.assign({ type }, info);
        if (type !== 'object') {
            context[field].value = fieldValue;
            return;
        }
        context[field].value = {};
        Object.entries(fieldValue)
            .forEach(([subField, value]) => {
            if (value.rel) {
                actions[`${field}-${subField.name || subField}`] = generateIdxAction(authClient, value, toPersist);
            }
            else {
                context[field].value[subField] = value;
            }
        });
    });
    return { context, actions };
};
const expandRelatesTo = (idxResponse, value) => {
    Object.keys(value).forEach(k => {
        if (k === 'relatesTo') {
            const query = Array.isArray(value[k]) ? value[k][0] : value[k];
            if (typeof query === 'string') {
                const result = jsonpath({ path: query, json: idxResponse })[0];
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
    if (remediation.rel) {
        const remediationActions = generateRemediationFunctions(authClient, [remediation], toPersist);
        const actionFn = remediationActions[remediation.name];
        return Object.assign(Object.assign({}, remediation), { action: actionFn });
    }
    return remediation;
};
const parseIdxResponse = function parseIdxResponse(authClient, idxResponse, toPersist = {}) {
    var _a;
    const remediationData = ((_a = idxResponse.remediation) === null || _a === void 0 ? void 0 : _a.value) || [];
    remediationData.forEach(remediation => expandRelatesTo(idxResponse, remediation));
    const remediations = remediationData.map(remediation => convertRemediationAction(authClient, remediation, toPersist));
    const { context, actions } = parseNonRemediations(authClient, idxResponse, toPersist);
    return {
        remediations,
        context,
        actions,
    };
};

export { parseIdxResponse, parseNonRemediations };
//# sourceMappingURL=idxResponseParser.js.map
