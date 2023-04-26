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

import { __rest } from '../../../_virtual/_tslib.js';
import { Remediator } from '../Base/Remediator.js';
import { unwrapFormValue } from './util.js';

class GenericRemediator extends Remediator {
    canRemediate() {
        if (typeof this.remediation.action !== 'function') {
            return false;
        }
        if (this.remediation.name === 'poll' || this.remediation.name.endsWith('-poll')) {
            return true;
        }
        if (this.options.step) {
            return true;
        }
        return false;
    }
    getData() {
        const data = this.getInputs().reduce((acc, { name }) => {
            acc[name] = this.values[name];
            return acc;
        }, {});
        return data;
    }
    getNextStep(authClient, _context) {
        const name = this.getName();
        const inputs = this.getInputs();
        const _a = this.remediation, {
        href, method, rel, accepts, produces,
        value,
        action } = _a, rest = __rest(_a, ["href", "method", "rel", "accepts", "produces", "value", "action"]);
        if (action) {
            return Object.assign(Object.assign(Object.assign({}, rest), (!!inputs.length && { inputs })), { action: async (params) => {
                    return authClient.idx.proceed(Object.assign({ step: name }, params));
                } });
        }
        return Object.assign({}, this.remediation);
    }
    getInputs() {
        return (this.remediation.value || [])
            .filter(({ name }) => name !== 'stateHandle')
            .map(unwrapFormValue)
            .map(input => {
            input.type = input.type || 'string';
            return input;
        });
    }
}

export { GenericRemediator };
//# sourceMappingURL=GenericRemediator.js.map
