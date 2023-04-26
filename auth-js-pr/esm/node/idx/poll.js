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

import { proceed } from './proceed.js';
import { getSavedTransactionMeta } from './transactionMeta.js';
import { warn } from '../util/console.js';

async function poll(authClient, options = {}) {
    var _a;
    let transaction = await proceed(authClient, {
        startPolling: true
    });
    const meta = getSavedTransactionMeta(authClient);
    let availablePollingRemeditaions = (_a = meta === null || meta === void 0 ? void 0 : meta.remediations) === null || _a === void 0 ? void 0 : _a.find(remediation => remediation.includes('poll'));
    if (!(availablePollingRemeditaions === null || availablePollingRemeditaions === void 0 ? void 0 : availablePollingRemeditaions.length)) {
        warn('No polling remediations available at the current IDX flow stage');
    }
    if (Number.isInteger(options.refresh)) {
        return new Promise(function (resolve, reject) {
            setTimeout(async function () {
                var _a, _b;
                try {
                    const refresh = (_b = (_a = transaction.nextStep) === null || _a === void 0 ? void 0 : _a.poll) === null || _b === void 0 ? void 0 : _b.refresh;
                    if (refresh) {
                        resolve(poll(authClient, {
                            refresh
                        }));
                    }
                    else {
                        resolve(transaction);
                    }
                }
                catch (err) {
                    reject(err);
                }
            }, options.refresh);
        });
    }
    return transaction;
}

export { poll };
//# sourceMappingURL=poll.js.map
