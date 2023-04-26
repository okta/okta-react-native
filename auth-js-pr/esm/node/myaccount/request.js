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

import ProfileTransaction from './transactions/ProfileTransaction.js';
import ProfileSchemaTransaction from './transactions/ProfileSchemaTransaction.js';
import EmailTransaction from './transactions/EmailTransaction.js';
import EmailStatusTransaction from './transactions/EmailStatusTransaction.js';
import EmailChallengeTransaction from './transactions/EmailChallengeTransaction.js';
import PhoneTransaction from './transactions/PhoneTransaction.js';
import PasswordTransaction from './transactions/PasswordTransaction.js';
import BaseTransaction from './transactions/Base.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import '../crypto/node.js';
import { httpRequest } from '../http/request.js';
import 'tiny-emitter';
import '../server/serverStorage.js';
import 'cross-fetch';

async function sendRequest(oktaAuth, options) {
    const { accessToken: accessTokenObj } = oktaAuth.tokenManager.getTokensSync();
    const accessToken = options.accessToken || (accessTokenObj === null || accessTokenObj === void 0 ? void 0 : accessTokenObj.accessToken);
    const issuer = oktaAuth.getIssuerOrigin();
    const { url, method, payload } = options;
    const requestUrl = url.startsWith(issuer) ? url : `${issuer}${url}`;
    if (!accessToken) {
        throw new AuthSdkError('AccessToken is required to request MyAccount API endpoints.');
    }
    const res = await httpRequest(oktaAuth, Object.assign({ headers: { 'Accept': '*/*;okta-version=1.0.0' }, accessToken, url: requestUrl, method }, (payload && { args: payload })));
    const map = {
        EmailTransaction,
        EmailStatusTransaction,
        EmailChallengeTransaction,
        ProfileTransaction,
        ProfileSchemaTransaction,
        PhoneTransaction,
        PasswordTransaction
    };
    const TransactionClass = map[options.transactionClassName] || BaseTransaction;
    if (Array.isArray(res)) {
        return res.map(item => new TransactionClass(oktaAuth, {
            res: item,
            accessToken
        }));
    }
    return new TransactionClass(oktaAuth, {
        res,
        accessToken
    });
}
function generateRequestFnFromLinks({ oktaAuth, accessToken, methodName, links, transactionClassName }) {
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
        if (method.toLowerCase() === methodName) {
            const link = links.self;
            return (async (payload) => sendRequest(oktaAuth, {
                accessToken,
                url: link.href,
                method,
                payload,
                transactionClassName
            }));
        }
    }
    const link = links[methodName];
    if (!link) {
        throw new AuthSdkError(`No link is found with methodName: ${methodName}`);
    }
    return (async (payload) => sendRequest(oktaAuth, {
        accessToken,
        url: link.href,
        method: link.hints.allow[0],
        payload,
        transactionClassName
    }));
}

export { generateRequestFnFromLinks, sendRequest };
//# sourceMappingURL=request.js.map
