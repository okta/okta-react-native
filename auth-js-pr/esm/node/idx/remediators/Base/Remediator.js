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

import { getRequiredValues, getAllValues, titleCase, getAuthenticatorFromRemediation } from '../util.js';
import { formatAuthenticator, compareAuthenticators } from '../../authenticator/util.js';

class Remediator {
    constructor(remediation, values = {}, options = {}) {
        this.values = Object.assign({}, values);
        this.options = Object.assign({}, options);
        this.formatAuthenticators();
        this.remediation = remediation;
    }
    formatAuthenticators() {
        this.values.authenticators = (this.values.authenticators || []);
        this.values.authenticators = this.values.authenticators.map(authenticator => {
            return formatAuthenticator(authenticator);
        });
        if (this.values.authenticator) {
            const authenticator = formatAuthenticator(this.values.authenticator);
            const hasAuthenticatorInList = this.values.authenticators.some(existing => {
                return compareAuthenticators(authenticator, existing);
            });
            if (!hasAuthenticatorInList) {
                this.values.authenticators.push(authenticator);
            }
        }
        this.values.authenticatorsData = this.values.authenticators.reduce((acc, authenticator) => {
            if (typeof authenticator === 'object' && Object.keys(authenticator).length > 1) {
                acc.push(authenticator);
            }
            return acc;
        }, this.values.authenticatorsData || []);
    }
    getName() {
        return this.remediation.name;
    }
    canRemediate() {
        const required = getRequiredValues(this.remediation);
        const needed = required.find((key) => !this.hasData(key));
        if (needed) {
            return false;
        }
        return true;
    }
    getData(key) {
        if (!key) {
            let allValues = getAllValues(this.remediation);
            let res = allValues.reduce((data, key) => {
                data[key] = this.getData(key);
                return data;
            }, {});
            return res;
        }
        if (typeof this[`map${titleCase(key)}`] === 'function') {
            const val = this[`map${titleCase(key)}`](this.remediation.value.find(({ name }) => name === key));
            if (val) {
                return val;
            }
        }
        if (this.map && this.map[key]) {
            const entry = this.map[key];
            for (let i = 0; i < entry.length; i++) {
                let val = this.values[entry[i]];
                if (val) {
                    return val;
                }
            }
        }
        return this.values[key];
    }
    hasData(key
    ) {
        return !!this.getData(key);
    }
    getNextStep(_authClient, _context) {
        const name = this.getName();
        const inputs = this.getInputs();
        const authenticator = this.getAuthenticator();
        const type = authenticator === null || authenticator === void 0 ? void 0 : authenticator.type;
        return Object.assign(Object.assign({ name,
            inputs }, (type && { type })), (authenticator && { authenticator }));
    }
    getInputs() {
        const inputs = [];
        const inputsFromRemediation = this.remediation.value || [];
        inputsFromRemediation.forEach(inputFromRemediation => {
            let input;
            let { name, type, visible, messages } = inputFromRemediation;
            if (visible === false) {
                return;
            }
            if (typeof this[`getInput${titleCase(name)}`] === 'function') {
                input = this[`getInput${titleCase(name)}`](inputFromRemediation);
            }
            else if (type !== 'object') {
                let alias;
                const aliases = (this.map ? this.map[name] : null) || [];
                if (aliases.length === 1) {
                    alias = aliases[0];
                }
                else {
                    alias = aliases.find(name => Object.keys(this.values).includes(name));
                }
                if (alias) {
                    input = Object.assign(Object.assign({}, inputFromRemediation), { name: alias });
                }
            }
            if (!input) {
                input = inputFromRemediation;
            }
            if (Array.isArray(input)) {
                input.forEach(i => inputs.push(i));
            }
            else {
                if (messages) {
                    input.messages = messages;
                }
                inputs.push(input);
            }
        });
        return inputs;
    }
    static getMessages(remediation) {
        var _a, _b;
        if (!remediation.value) {
            return;
        }
        return (_b = (_a = remediation.value[0]) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.value.reduce((messages, field) => {
            if (field.messages) {
                messages = [...messages, ...field.messages.value];
            }
            return messages;
        }, []);
    }
    getValuesAfterProceed() {
        const inputsFromRemediation = this.remediation.value || [];
        const inputsFromRemediator = this.getInputs();
        const inputs = [
            ...inputsFromRemediation,
            ...inputsFromRemediator
        ];
        for (const input of inputs) {
            delete this.values[input.name];
        }
        return this.values;
    }
    getAuthenticator() {
        var _a, _b;
        const relatesTo = (_a = this.remediation.relatesTo) === null || _a === void 0 ? void 0 : _a.value;
        if (!relatesTo) {
            return;
        }
        const authenticatorFromRemediation = getAuthenticatorFromRemediation(this.remediation);
        if (!authenticatorFromRemediation) {
            return relatesTo;
        }
        const id = authenticatorFromRemediation.form.value
            .find(({ name }) => name === 'id').value;
        const enrollmentId = (_b = authenticatorFromRemediation.form.value
            .find(({ name }) => name === 'enrollmentId')) === null || _b === void 0 ? void 0 : _b.value;
        return Object.assign(Object.assign({}, relatesTo), { id,
            enrollmentId });
    }
}

export { Remediator };
//# sourceMappingURL=Remediator.js.map
