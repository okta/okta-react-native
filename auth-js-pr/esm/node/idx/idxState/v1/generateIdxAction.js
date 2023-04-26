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

import AuthApiError from '../../../errors/AuthApiError.js';
import '../../../crypto/node.js';
import { httpRequest } from '../../../http/request.js';
import 'tiny-emitter';
import '../../../server/serverStorage.js';
import 'cross-fetch';
import { divideActionParamsByMutability } from './actionParser.js';

const generateDirectFetch = function generateDirectFetch(authClient, { actionDefinition, defaultParamsForAction = {}, immutableParamsForAction = {}, toPersist = {} }) {
    const target = actionDefinition.href;
    return async function (params = {}) {
        var _a;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': actionDefinition.accepts || 'application/ion+json',
        };
        const body = JSON.stringify(Object.assign(Object.assign(Object.assign({}, defaultParamsForAction), params), immutableParamsForAction));
        try {
            const response = await httpRequest(authClient, {
                url: target,
                method: actionDefinition.method,
                headers,
                args: body,
                withCredentials: (_a = toPersist === null || toPersist === void 0 ? void 0 : toPersist.withCredentials) !== null && _a !== void 0 ? _a : true
            });
            return authClient.idx.makeIdxResponse(Object.assign({}, response), toPersist, true);
        }
        catch (err) {
            if (!(err instanceof AuthApiError) || !(err === null || err === void 0 ? void 0 : err.xhr)) {
                throw err;
            }
            const response = err.xhr;
            const payload = response.responseJSON || JSON.parse(response.responseText);
            const wwwAuthHeader = response.headers['WWW-Authenticate'] || response.headers['www-authenticate'];
            const idxResponse = authClient.idx.makeIdxResponse(Object.assign({}, payload), toPersist, false);
            if (response.status === 401 && wwwAuthHeader === 'Oktadevicejwt realm="Okta Device"') {
                idxResponse.stepUp = true;
            }
            return idxResponse;
        }
    };
};
const generateIdxAction = function generateIdxAction(authClient, actionDefinition, toPersist) {
    const generator = generateDirectFetch;
    const { defaultParams, neededParams, immutableParams } = divideActionParamsByMutability(actionDefinition);
    const action = generator(authClient, {
        actionDefinition,
        defaultParamsForAction: defaultParams[actionDefinition.name],
        immutableParamsForAction: immutableParams[actionDefinition.name],
        toPersist
    });
    action.neededParams = neededParams;
    return action;
};

export { generateIdxAction as default };
//# sourceMappingURL=generateIdxAction.js.map
