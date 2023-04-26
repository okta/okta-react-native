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

import { link2fn } from './link2fn.js';
import { getPollFn } from './poll.js';

function links2fns(sdk, tx, res, obj, ref) {
    var fns = {};
    for (var linkName in obj._links) {
        if (!Object.prototype.hasOwnProperty.call(obj._links, linkName)) {
            continue;
        }
        var link = obj._links[linkName];
        if (linkName === 'next') {
            linkName = link.name;
        }
        if (link.type) {
            fns[linkName] = link;
            continue;
        }
        switch (linkName) {
            case 'poll':
                fns.poll = getPollFn(sdk, res, ref);
                break;
            default:
                var fn = link2fn(sdk, tx, res, obj, link, ref);
                if (fn) {
                    fns[linkName] = fn;
                }
        }
    }
    return fns;
}

export { links2fns };
//# sourceMappingURL=links2fns.js.map
