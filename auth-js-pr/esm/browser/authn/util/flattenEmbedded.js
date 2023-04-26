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

import { clone, omit } from '../../util/object.js';
import { isObject } from '../../util/types.js';
import { links2fns } from './links2fns.js';

function flattenEmbedded(sdk, tx, res, obj, ref) {
    obj = obj || res;
    obj = clone(obj);
    if (Array.isArray(obj)) {
        var objArr = [];
        for (var o = 0, ol = obj.length; o < ol; o++) {
            objArr.push(flattenEmbedded(sdk, tx, res, obj[o], ref));
        }
        return objArr;
    }
    var embedded = obj._embedded || {};
    for (var key in embedded) {
        if (!Object.prototype.hasOwnProperty.call(embedded, key)) {
            continue;
        }
        if (isObject(embedded[key]) || Array.isArray(embedded[key])) {
            embedded[key] = flattenEmbedded(sdk, tx, res, embedded[key], ref);
        }
    }
    var fns = links2fns(sdk, tx, res, obj, ref);
    Object.assign(embedded, fns);
    obj = omit(obj, '_embedded', '_links');
    Object.assign(obj, embedded);
    return obj;
}

export { flattenEmbedded };
//# sourceMappingURL=flattenEmbedded.js.map
