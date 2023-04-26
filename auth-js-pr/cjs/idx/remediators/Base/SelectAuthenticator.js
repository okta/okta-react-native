"use strict";

exports.SelectAuthenticator = void 0;
var _Remediator = require("./Remediator");
var _util = require("../util");
var _api = require("../../types/api");
var _util2 = require("../../authenticator/util");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

// Base class - DO NOT expose static remediationName
class SelectAuthenticator extends _Remediator.Remediator {
  // Find matched authenticator in provided order
  findMatchedOption(authenticators, options) {
    let option;
    for (let authenticator of authenticators) {
      option = options.find(({
        relatesTo
      }) => relatesTo.key === authenticator.key);
      if (option) {
        break;
      }
    }
    return option;
  }
  canRemediate() {
    const {
      authenticators,
      authenticator
    } = this.values;
    const authenticatorFromRemediation = (0, _util.getAuthenticatorFromRemediation)(this.remediation);
    const {
      options
    } = authenticatorFromRemediation;
    // Let users select authenticator if no input is provided
    if (!authenticators || !authenticators.length) {
      return false;
    }

    // Authenticator is explicitly specified by id
    if ((0, _api.isAuthenticator)(authenticator) && authenticator.id) {
      return true;
    }

    // Proceed with provided authenticators
    const matchedOption = this.findMatchedOption(authenticators, options);
    if (matchedOption) {
      return true;
    }
    return false;
  }
  mapAuthenticator(remediationValue) {
    const {
      authenticators,
      authenticator
    } = this.values;

    // Authenticator is explicitly specified by id
    if ((0, _api.isAuthenticator)(authenticator) && authenticator.id) {
      this.selectedAuthenticator = authenticator; // track the selected authenticator
      return authenticator;
    }
    const {
      options
    } = remediationValue;
    const selectedOption = (0, _util2.findMatchedOption)(authenticators, options);
    this.selectedAuthenticator = selectedOption.relatesTo; // track the selected authenticator
    this.selectedOption = selectedOption;
    return {
      id: selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.value.form.value.find(({
        name
      }) => name === 'id').value
    };
  }
  getInputAuthenticator(remediation) {
    const options = remediation.options.map(({
      label,
      relatesTo
    }) => {
      return {
        label,
        value: relatesTo.key
      };
    });
    return {
      name: 'authenticator',
      type: 'string',
      options
    };
  }
  getValuesAfterProceed() {
    this.values = super.getValuesAfterProceed();
    // remove used authenticators
    const authenticators = this.values.authenticators.filter(authenticator => {
      return (0, _util2.compareAuthenticators)(authenticator, this.selectedAuthenticator) !== true;
    });
    return {
      ...this.values,
      authenticators
    };
  }
}
exports.SelectAuthenticator = SelectAuthenticator;
//# sourceMappingURL=SelectAuthenticator.js.map