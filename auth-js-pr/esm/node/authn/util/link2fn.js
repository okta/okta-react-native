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

import { find, omit } from '../../util/object.js';
import { toQueryString } from '../../util/url.js';
import AuthSdkError from '../../errors/AuthSdkError.js';
import '../../crypto/node.js';
import { get } from '../../http/request.js';
import 'tiny-emitter';
import '../../server/serverStorage.js';
import 'cross-fetch';
import { postToTransaction } from '../api.js';
import { addStateToken } from './stateToken.js';

function link2fn(sdk, tx, res, obj, link, ref) {
    if (Array.isArray(link)) {
        return function (name, opts) {
            if (!name) {
                throw new AuthSdkError('Must provide a link name');
            }
            var lk = find(link, { name: name });
            if (!lk) {
                throw new AuthSdkError('No link found for that name');
            }
            return link2fn(sdk, tx, res, obj, lk, ref)(opts);
        };
    }
    else if (link.hints &&
        link.hints.allow &&
        link.hints.allow.length === 1) {
        var method = link.hints.allow[0];
        switch (method) {
            case 'GET':
                return function () {
                    return get(sdk, link.href, { withCredentials: true });
                };
            case 'POST':
                return function (opts) {
                    if (ref && ref.isPolling) {
                        ref.isPolling = false;
                    }
                    var data = addStateToken(res, opts);
                    if (res.status === 'MFA_ENROLL' || res.status === 'FACTOR_ENROLL') {
                        Object.assign(data, {
                            factorType: obj.factorType,
                            provider: obj.provider
                        });
                    }
                    var params = {};
                    var autoPush = data.autoPush;
                    if (autoPush !== undefined) {
                        if (typeof autoPush === 'function') {
                            try {
                                params.autoPush = !!autoPush();
                            }
                            catch (e) {
                                return Promise.reject(new AuthSdkError('AutoPush resulted in an error.'));
                            }
                        }
                        else if (autoPush !== null) {
                            params.autoPush = !!autoPush;
                        }
                        data = omit(data, 'autoPush');
                    }
                    var rememberDevice = data.rememberDevice;
                    if (rememberDevice !== undefined) {
                        if (typeof rememberDevice === 'function') {
                            try {
                                params.rememberDevice = !!rememberDevice();
                            }
                            catch (e) {
                                return Promise.reject(new AuthSdkError('RememberDevice resulted in an error.'));
                            }
                        }
                        else if (rememberDevice !== null) {
                            params.rememberDevice = !!rememberDevice;
                        }
                        data = omit(data, 'rememberDevice');
                    }
                    else if (data.profile &&
                        data.profile.updatePhone !== undefined) {
                        if (data.profile.updatePhone) {
                            params.updatePhone = true;
                        }
                        data.profile = omit(data.profile, 'updatePhone');
                    }
                    var href = link.href + toQueryString(params);
                    return postToTransaction(sdk, tx, href, data);
                };
        }
    }
}

export { link2fn };
//# sourceMappingURL=link2fn.js.map
