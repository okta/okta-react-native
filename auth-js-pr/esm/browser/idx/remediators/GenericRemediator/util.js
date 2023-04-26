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

function unwrapFormValue(remediation) {
    if (Array.isArray(remediation)) {
        return remediation
            .map(item => {
            if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
                return item;
            }
            return unwrapFormValue(item);
        });
    }
    const res = {};
    for (const [key, value] of Object.entries(remediation)) {
        if (value === null || typeof value === 'undefined') {
            continue;
        }
        if (typeof value === 'object') {
            const formKeys = Object.keys(value);
            if (['value', 'form'].includes(key)
                && formKeys.length === 1
                && ['value', 'form'].includes(formKeys[0])) {
                const unwrappedForm = unwrapFormValue(value);
                Object.entries(unwrappedForm).forEach(([key, value]) => {
                    res[key] = value;
                });
            }
            else {
                res[key] = unwrapFormValue(value);
            }
        }
        else {
            res[key] = value;
        }
    }
    return res;
}

export { unwrapFormValue };
//# sourceMappingURL=util.js.map
