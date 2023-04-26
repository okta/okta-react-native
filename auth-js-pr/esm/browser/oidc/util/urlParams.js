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

function urlParamsToObject(hashOrSearch) {
    var plus2space = /\+/g;
    var paramSplit = /([^&=]+)=?([^&]*)/g;
    var fragment = hashOrSearch || '';
    if (fragment.charAt(0) === '#' && fragment.charAt(1) === '/') {
        fragment = fragment.substring(2);
    }
    if (fragment.charAt(0) === '#' || fragment.charAt(0) === '?') {
        fragment = fragment.substring(1);
    }
    var obj = {};
    var param;
    while (true) {
        param = paramSplit.exec(fragment);
        if (!param) {
            break;
        }
        var key = param[1];
        var value = param[2];
        if (key === 'id_token' || key === 'access_token' || key === 'code') {
            obj[key] = value;
        }
        else {
            obj[key] = decodeURIComponent(value.replace(plus2space, ' '));
        }
    }
    return obj;
}

export { urlParamsToObject };
//# sourceMappingURL=urlParams.js.map
