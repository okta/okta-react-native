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

import { Remediator } from './Remediator.js';
import { getAuthenticatorFromRemediation } from '../util.js';
import { isAuthenticator } from '../../types/api.js';
import { findMatchedOption, compareAuthenticators } from '../../authenticator/util.js';

class SelectAuthenticator extends Remediator {
    findMatchedOption(authenticators, options) {
        let option;
        for (let authenticator of authenticators) {
            option = options
                .find(({ relatesTo }) => relatesTo.key === authenticator.key);
            if (option) {
                break;
            }
        }
        return option;
    }
    canRemediate() {
        const { authenticators, authenticator } = this.values;
        const authenticatorFromRemediation = getAuthenticatorFromRemediation(this.remediation);
        const { options } = authenticatorFromRemediation;
        if (!authenticators || !authenticators.length) {
            return false;
        }
        if (isAuthenticator(authenticator) && authenticator.id) {
            return true;
        }
        const matchedOption = this.findMatchedOption(authenticators, options);
        if (matchedOption) {
            return true;
        }
        return false;
    }
    mapAuthenticator(remediationValue) {
        const { authenticators, authenticator } = this.values;
        if (isAuthenticator(authenticator) && authenticator.id) {
            this.selectedAuthenticator = authenticator;
            return authenticator;
        }
        const { options } = remediationValue;
        const selectedOption = findMatchedOption(authenticators, options);
        this.selectedAuthenticator = selectedOption.relatesTo;
        this.selectedOption = selectedOption;
        return {
            id: selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.value.form.value.find(({ name }) => name === 'id').value
        };
    }
    getInputAuthenticator(remediation) {
        const options = remediation.options.map(({ label, relatesTo }) => {
            return {
                label,
                value: relatesTo.key
            };
        });
        return { name: 'authenticator', type: 'string', options };
    }
    getValuesAfterProceed() {
        this.values = super.getValuesAfterProceed();
        const authenticators = this.values.authenticators
            .filter(authenticator => {
            return compareAuthenticators(authenticator, this.selectedAuthenticator) !== true;
        });
        return Object.assign(Object.assign({}, this.values), { authenticators });
    }
}

export { SelectAuthenticator };
//# sourceMappingURL=SelectAuthenticator.js.map
