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

import { IDX_API_VERSION } from '../../constants.js';
import v1 from './v1/parsers.js';

const parsersForVersion = function parsersForVersion(version) {
    switch (version) {
        case '1.0.0':
            return v1;
        case undefined:
        case null:
            throw new Error('Api version is required');
        default:
            throw new Error(`Unknown api version: ${version}.  Use an exact semver version.`);
    }
};
function validateVersionConfig(version) {
    if (!version) {
        throw new Error('version is required');
    }
    const cleanVersion = (version !== null && version !== void 0 ? version : '').replace(/[^0-9a-zA-Z._-]/, '');
    if (cleanVersion !== version || !version) {
        throw new Error('invalid version supplied - version is required and uses semver syntax');
    }
    parsersForVersion(version);
}
function makeIdxState(authClient, rawIdxResponse, toPersist, requestDidSucceed) {
    var _a;
    const version = (_a = rawIdxResponse === null || rawIdxResponse === void 0 ? void 0 : rawIdxResponse.version) !== null && _a !== void 0 ? _a : IDX_API_VERSION;
    validateVersionConfig(version);
    const { makeIdxState } = parsersForVersion(version);
    return makeIdxState(authClient, rawIdxResponse, toPersist, requestDidSucceed);
}

export { makeIdxState, parsersForVersion, validateVersionConfig };
//# sourceMappingURL=index.js.map
