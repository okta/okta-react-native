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

import { OktaUserAgent } from './OktaUserAgent.js';
import { setRequestHeader } from './headers.js';
import { toQueryString } from '../util/url.js';
import { get } from './request.js';

function mixinHttp(Base) {
    return class OktaAuthHttp extends Base {
        constructor(...args) {
            super(...args);
            this._oktaUserAgent = new OktaUserAgent();
            this.http = {
                setRequestHeader: setRequestHeader.bind(null, this)
            };
        }
        setHeaders(headers) {
            this.options.headers = Object.assign({}, this.options.headers, headers);
        }
        getIssuerOrigin() {
            return this.options.issuer.split('/oauth2/')[0];
        }
        webfinger(opts) {
            var url = '/.well-known/webfinger' + toQueryString(opts);
            var options = {
                headers: {
                    'Accept': 'application/jrd+json'
                }
            };
            return get(this, url, options);
        }
    };
}

export { mixinHttp };
//# sourceMappingURL=mixin.js.map
