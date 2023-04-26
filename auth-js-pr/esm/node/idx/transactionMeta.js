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

import { warn } from '../util/console.js';
import { removeNils } from '../util/object.js';
import '../crypto/node.js';
import { createOAuthMeta } from '../oidc/util/oauthMeta.js';
import 'tiny-emitter';
import '../server/serverStorage.js';
import 'cross-fetch';

async function createTransactionMeta(authClient, options = {}) {
    const tokenParams = await authClient.token.prepareTokenParams(options);
    const pkceMeta = createOAuthMeta(authClient, tokenParams);
    let { flow = 'default', withCredentials = true, activationToken = undefined, recoveryToken = undefined, maxAge = undefined, acrValues = undefined, } = Object.assign(Object.assign({}, authClient.options), options);
    const meta = Object.assign(Object.assign({}, pkceMeta), { flow,
        withCredentials,
        activationToken,
        recoveryToken,
        maxAge,
        acrValues });
    return meta;
}
function hasSavedInteractionHandle(authClient, options) {
    const savedMeta = getSavedTransactionMeta(authClient, options);
    if (savedMeta === null || savedMeta === void 0 ? void 0 : savedMeta.interactionHandle) {
        return true;
    }
    return false;
}
function getSavedTransactionMeta(authClient, options) {
    options = removeNils(options);
    options = Object.assign(Object.assign({}, authClient.options), options);
    let savedMeta;
    try {
        savedMeta = authClient.transactionManager.load(options);
    }
    catch (e) {
    }
    if (!savedMeta) {
        return;
    }
    if (isTransactionMetaValid(savedMeta, options)) {
        return savedMeta;
    }
    warn('Saved transaction meta does not match the current configuration. ' +
        'This may indicate that two apps are sharing a storage key.');
}
async function getTransactionMeta(authClient, options) {
    options = removeNils(options);
    options = Object.assign(Object.assign({}, authClient.options), options);
    const validExistingMeta = getSavedTransactionMeta(authClient, options);
    if (validExistingMeta) {
        return validExistingMeta;
    }
    return createTransactionMeta(authClient, options);
}
function saveTransactionMeta(authClient, meta) {
    authClient.transactionManager.save(meta, { muteWarning: true });
}
function clearTransactionMeta(authClient) {
    authClient.transactionManager.clear();
}
function isTransactionMetaValid(meta, options = {}) {
    const keys = [
        'issuer',
        'clientId',
        'redirectUri',
        'state',
        'codeChallenge',
        'codeChallengeMethod',
        'activationToken',
        'recoveryToken'
    ];
    if (isTransactionMetaValidForOptions(meta, options, keys) === false) {
        return false;
    }
    const { flow } = options;
    if (isTransactionMetaValidForFlow(meta, flow) === false) {
        return false;
    }
    return true;
}
function isTransactionMetaValidForFlow(meta, flow) {
    const shouldValidateFlow = flow && flow !== 'default' && flow !== 'proceed';
    if (shouldValidateFlow) {
        if (flow !== meta.flow) {
            return false;
        }
    }
    return true;
}
function isTransactionMetaValidForOptions(meta, options, keys) {
    const mismatch = keys.some(key => {
        const value = options[key];
        if (value && value !== meta[key]) {
            return true;
        }
    });
    return !mismatch;
}

export { clearTransactionMeta, createTransactionMeta, getSavedTransactionMeta, getTransactionMeta, hasSavedInteractionHandle, isTransactionMetaValid, isTransactionMetaValidForFlow, isTransactionMetaValidForOptions, saveTransactionMeta };
//# sourceMappingURL=transactionMeta.js.map
