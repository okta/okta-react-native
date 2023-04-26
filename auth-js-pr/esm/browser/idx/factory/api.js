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

import { isInteractionRequiredError } from '../../oidc/util/errors.js';
import { isInteractionRequired } from '../../oidc/util/loginRedirect.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';
import { authenticate } from '../authenticate.js';
import { cancel } from '../cancel.js';
import { handleEmailVerifyCallback, isEmailVerifyCallback, parseEmailVerifyCallback, isEmailVerifyCallbackError } from '../emailVerify.js';
import { handleInteractionCodeRedirect } from '../handleInteractionCodeRedirect.js';
import { makeIdxState } from '../idxState/index.js';
import { interact } from '../interact.js';
import { introspect } from '../introspect.js';
import { poll } from '../poll.js';
import { proceed, canProceed } from '../proceed.js';
import { recoverPassword } from '../recoverPassword.js';
import { register } from '../register.js';
import { startTransaction } from '../startTransaction.js';
import { getSavedTransactionMeta, createTransactionMeta, getTransactionMeta, saveTransactionMeta, clearTransactionMeta, isTransactionMetaValid } from '../transactionMeta.js';
import { unlockAccount } from '../unlockAccount.js';

function createIdxAPI(sdk) {
    const boundStartTransaction = startTransaction.bind(null, sdk);
    const idx = {
        interact: interact.bind(null, sdk),
        introspect: introspect.bind(null, sdk),
        makeIdxResponse: makeIdxState.bind(null, sdk),
        authenticate: authenticate.bind(null, sdk),
        register: register.bind(null, sdk),
        start: boundStartTransaction,
        startTransaction: boundStartTransaction,
        poll: poll.bind(null, sdk),
        proceed: proceed.bind(null, sdk),
        cancel: cancel.bind(null, sdk),
        recoverPassword: recoverPassword.bind(null, sdk),
        handleInteractionCodeRedirect: handleInteractionCodeRedirect.bind(null, sdk),
        isInteractionRequired: isInteractionRequired.bind(null, sdk),
        isInteractionRequiredError,
        handleEmailVerifyCallback: handleEmailVerifyCallback.bind(null, sdk),
        isEmailVerifyCallback,
        parseEmailVerifyCallback,
        isEmailVerifyCallbackError,
        getSavedTransactionMeta: getSavedTransactionMeta.bind(null, sdk),
        createTransactionMeta: createTransactionMeta.bind(null, sdk),
        getTransactionMeta: getTransactionMeta.bind(null, sdk),
        saveTransactionMeta: saveTransactionMeta.bind(null, sdk),
        clearTransactionMeta: clearTransactionMeta.bind(null, sdk),
        isTransactionMetaValid,
        setFlow: (flow) => {
            sdk.options.flow = flow;
        },
        getFlow: () => {
            return sdk.options.flow;
        },
        canProceed: canProceed.bind(null, sdk),
        unlockAccount: unlockAccount.bind(null, sdk),
    };
    return idx;
}

export { createIdxAPI };
//# sourceMappingURL=api.js.map
