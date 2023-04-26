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
import { post } from '../http/request.js';
import { STATE_TOKEN_KEY_NAME } from '../constants.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';
import { addStateToken } from './util/stateToken.js';

function transactionStatus(sdk, args) {
    args = addStateToken(sdk, args);
    return post(sdk, sdk.getIssuerOrigin() + '/api/v1/authn', args, { withCredentials: true });
}
function resumeTransaction(sdk, tx, args) {
    if (!args || !args.stateToken) {
        var stateToken = getSavedStateToken(sdk);
        if (stateToken) {
            args = {
                stateToken: stateToken
            };
        }
        else {
            return Promise.reject(new AuthSdkError('No transaction to resume'));
        }
    }
    return transactionStatus(sdk, args)
        .then(function (res) {
        return tx.createTransaction(res);
    });
}
function introspectAuthn(sdk, tx, args) {
    if (!args || !args.stateToken) {
        var stateToken = getSavedStateToken(sdk);
        if (stateToken) {
            args = {
                stateToken: stateToken
            };
        }
        else {
            return Promise.reject(new AuthSdkError('No transaction to evaluate'));
        }
    }
    return transactionStep(sdk, args)
        .then(function (res) {
        return tx.createTransaction(res);
    });
}
function transactionStep(sdk, args) {
    args = addStateToken(sdk, args);
    return post(sdk, sdk.getIssuerOrigin() + '/api/v1/authn/introspect', args, { withCredentials: true });
}
function transactionExists(sdk) {
    return !!getSavedStateToken(sdk);
}
function postToTransaction(sdk, tx, url, args, options) {
    options = Object.assign({ withCredentials: true }, options);
    return post(sdk, url, args, options)
        .then(function (res) {
        return tx.createTransaction(res);
    });
}
function getSavedStateToken(sdk) {
    const storage = sdk.options.storageUtil.storage;
    return storage.get(STATE_TOKEN_KEY_NAME);
}

export { getSavedStateToken, introspectAuthn, postToTransaction, resumeTransaction, transactionExists, transactionStatus, transactionStep };
//# sourceMappingURL=api.js.map
