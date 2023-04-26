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

import { transactionStatus, resumeTransaction, transactionExists, introspectAuthn, postToTransaction } from './api.js';
import { AuthnTransactionImpl } from './AuthnTransactionImpl.js';

function createAuthnTransactionAPI(sdk) {
    const tx = {
        status: transactionStatus.bind(null, sdk),
        resume(args) {
            return resumeTransaction(sdk, tx, args);
        },
        exists: transactionExists.bind(null, sdk),
        introspect(args) {
            return introspectAuthn(sdk, tx, args);
        },
        createTransaction: (res) => {
            return new AuthnTransactionImpl(sdk, tx, res);
        },
        postToTransaction: (url, args, options) => {
            return postToTransaction(sdk, tx, url, args, options);
        }
    };
    return tx;
}

export { createAuthnTransactionAPI };
//# sourceMappingURL=factory.js.map
