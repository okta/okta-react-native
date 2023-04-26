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

import { run } from './run.js';
import { hasSavedInteractionHandle } from './transactionMeta.js';
import { startTransaction } from './startTransaction.js';
import AuthSdkError from '../errors/AuthSdkError.js';
import { IdxFeature } from './types/api.js';

async function unlockAccount(authClient, options = {}) {
    options.flow = 'unlockAccount';
    if (!hasSavedInteractionHandle(authClient)) {
        const { enabledFeatures } = await startTransaction(authClient, Object.assign(Object.assign({}, options), { autoRemediate: false }));
        if (enabledFeatures && !enabledFeatures.includes(IdxFeature.ACCOUNT_UNLOCK)) {
            throw new AuthSdkError('Self Service Account Unlock is not supported based on your current org configuration.');
        }
    }
    return run(authClient, Object.assign({}, options));
}

export { unlockAccount };
//# sourceMappingURL=unlockAccount.js.map
