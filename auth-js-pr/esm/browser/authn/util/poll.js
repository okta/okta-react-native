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

import AuthPollStopError from '../../errors/AuthPollStopError.js';
import AuthSdkError from '../../errors/AuthSdkError.js';
import { delay } from '../../util/misc.js';
import { getLink } from '../../util/object.js';
import { isNumber, isObject } from '../../util/types.js';
import { toQueryString } from '../../util/url.js';
import { post } from '../../http/request.js';
import { DEFAULT_POLLING_DELAY } from '../../constants.js';
import 'tiny-emitter';
import 'js-cookie';
import 'cross-fetch';
import { getStateToken } from './stateToken.js';

function getPollFn(sdk, res, ref) {
    return function (options) {
        var delay$1;
        var rememberDevice;
        var autoPush;
        var transactionCallBack;
        if (isNumber(options)) {
            delay$1 = options;
        }
        else if (isObject(options)) {
            options = options;
            delay$1 = options.delay;
            rememberDevice = options.rememberDevice;
            autoPush = options.autoPush;
            transactionCallBack = options.transactionCallBack;
        }
        if (!delay$1 && delay$1 !== 0) {
            delay$1 = DEFAULT_POLLING_DELAY;
        }
        var pollLink = getLink(res, 'next', 'poll');
        function pollFn() {
            var opts = {};
            if (typeof autoPush === 'function') {
                try {
                    opts.autoPush = !!autoPush();
                }
                catch (e) {
                    return Promise.reject(new AuthSdkError('AutoPush resulted in an error.'));
                }
            }
            else if (autoPush !== undefined && autoPush !== null) {
                opts.autoPush = !!autoPush;
            }
            if (typeof rememberDevice === 'function') {
                try {
                    opts.rememberDevice = !!rememberDevice();
                }
                catch (e) {
                    return Promise.reject(new AuthSdkError('RememberDevice resulted in an error.'));
                }
            }
            else if (rememberDevice !== undefined && rememberDevice !== null) {
                opts.rememberDevice = !!rememberDevice;
            }
            var href = pollLink.href + toQueryString(opts);
            return post(sdk, href, getStateToken(res), {
                saveAuthnState: false,
                withCredentials: true
            });
        }
        ref.isPolling = true;
        var retryCount = 0;
        var recursivePoll = function () {
            if (!ref.isPolling) {
                return Promise.reject(new AuthPollStopError());
            }
            return pollFn()
                .then(function (pollRes) {
                retryCount = 0;
                if (pollRes.factorResult && pollRes.factorResult === 'WAITING') {
                    if (!ref.isPolling) {
                        throw new AuthPollStopError();
                    }
                    if (typeof transactionCallBack === 'function') {
                        transactionCallBack(pollRes);
                    }
                    return delay(delay$1).then(recursivePoll);
                }
                else {
                    ref.isPolling = false;
                    return sdk.tx.createTransaction(pollRes);
                }
            })
                .catch(function (err) {
                if (err.xhr &&
                    (err.xhr.status === 0 || err.xhr.status === 429) &&
                    retryCount <= 4) {
                    var delayLength = Math.pow(2, retryCount) * 1000;
                    retryCount++;
                    return delay(delayLength)
                        .then(recursivePoll);
                }
                throw err;
            });
        };
        return recursivePoll()
            .catch(function (err) {
            ref.isPolling = false;
            throw err;
        });
    };
}

export { getPollFn };
//# sourceMappingURL=poll.js.map
