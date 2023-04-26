"use strict";

exports.Remediator = void 0;
var _util = require("../util");
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

/* eslint-disable complexity */

// Base class - DO NOT expose static remediationName
class Remediator {
  constructor(remediation, values = {}, options = {}) {
    // assign fields to the instance
    this.values = {
      ...values
    };
    this.options = {
      ...options
    };
    this.formatAuthenticators();
    this.remediation = remediation;
  }
  formatAuthenticators() {
    this.values.authenticators = this.values.authenticators || [];

    // ensure authenticators are in the correct format
    this.values.authenticators = this.values.authenticators.map(authenticator => {
      return (0, _util2.formatAuthenticator)(authenticator);
    });

    // add authenticator (if any) to "authenticators"
    if (this.values.authenticator) {
      const authenticator = (0, _util2.formatAuthenticator)(this.values.authenticator);
      const hasAuthenticatorInList = this.values.authenticators.some(existing => {
        return (0, _util2.compareAuthenticators)(authenticator, existing);
      });
      if (!hasAuthenticatorInList) {
        this.values.authenticators.push(authenticator);
      }
    }

    // save non-key meta to "authenticatorsData" field
    // authenticators will be removed after selection to avoid select-authenticator loop
    this.values.authenticatorsData = this.values.authenticators.reduce((acc, authenticator) => {
      if (typeof authenticator === 'object' && Object.keys(authenticator).length > 1) {
        // save authenticator meta into authenticator data
        acc.push(authenticator);
      }
      return acc;
    }, this.values.authenticatorsData || []);
  }
  getName() {
    return this.remediation.name;
  }

  // Override this method to provide custom check
  /* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
  canRemediate() {
    const required = (0, _util.getRequiredValues)(this.remediation);
    const needed = required.find(key => !this.hasData(key));
    if (needed) {
      return false; // missing data for a required field
    }

    return true; // all required fields have available data
  }

  // returns an object for the entire remediation form, or just a part
  getData(key) {
    if (!key) {
      let allValues = (0, _util.getAllValues)(this.remediation);
      let res = allValues.reduce((data, key) => {
        data[key] = this.getData(key); // recursive
        return data;
      }, {});
      return res;
    }

    // Map value by "map${Property}" function in each subClass
    if (typeof this[`map${(0, _util.titleCase)(key)}`] === 'function') {
      const val = this[`map${(0, _util.titleCase)(key)}`](this.remediation.value.find(({
        name
      }) => name === key));
      if (val) {
        return val;
      }
    }

    // If a map is defined for this key, return the first aliased property that returns a truthy value
    if (this.map && this.map[key]) {
      const entry = this.map[key];
      for (let i = 0; i < entry.length; i++) {
        let val = this.values[entry[i]];
        if (val) {
          return val;
        }
      }
    }

    // fallback: return the value by key
    return this.values[key];
  }
  hasData(key) {
    // no attempt to format, we want simple true/false
    return !!this.getData(key);
  }
  getNextStep(_authClient, _context) {
    const name = this.getName();
    const inputs = this.getInputs();
    const authenticator = this.getAuthenticator();
    // TODO: remove type field in the next major version change
    // https://oktainc.atlassian.net/browse/OKTA-431749
    const type = authenticator === null || authenticator === void 0 ? void 0 : authenticator.type;
    return {
      name,
      inputs,
      ...(type && {
        type
      }),
      ...(authenticator && {
        authenticator
      })
    };
  }

  // Get inputs for the next step
  getInputs() {
    const inputs = [];
    const inputsFromRemediation = this.remediation.value || [];
    inputsFromRemediation.forEach(inputFromRemediation => {
      let input;
      let {
        name,
        type,
        visible,
        messages
      } = inputFromRemediation;
      if (visible === false) {
        return; // Filter out invisible inputs, like stateHandle
      }

      if (typeof this[`getInput${(0, _util.titleCase)(name)}`] === 'function') {
        input = this[`getInput${(0, _util.titleCase)(name)}`](inputFromRemediation);
      } else if (type !== 'object') {
        // handle general primitive types
        let alias;
        const aliases = (this.map ? this.map[name] : null) || [];
        if (aliases.length === 1) {
          alias = aliases[0];
        } else {
          // try find key from values
          alias = aliases.find(name => Object.keys(this.values).includes(name));
        }
        if (alias) {
          input = {
            ...inputFromRemediation,
            name: alias
          };
        }
      }
      if (!input) {
        input = inputFromRemediation;
      }
      if (Array.isArray(input)) {
        input.forEach(i => inputs.push(i));
      } else {
        // guarantees field-level messages are passed back
        if (messages) {
          input.messages = messages;
        }
        inputs.push(input);
      }
    });
    return inputs;
  }
  static getMessages(remediation) {
    var _remediation$value$, _remediation$value$$f;
    if (!remediation.value) {
      return;
    }
    return (_remediation$value$ = remediation.value[0]) === null || _remediation$value$ === void 0 ? void 0 : (_remediation$value$$f = _remediation$value$.form) === null || _remediation$value$$f === void 0 ? void 0 : _remediation$value$$f.value.reduce((messages, field) => {
      if (field.messages) {
        messages = [...messages, ...field.messages.value];
      }
      return messages;
    }, []);
  }

  // Prepare values for the next remediation
  // In general, remove used values from inputs for the current remediation
  // Override this method if special cases need be handled
  getValuesAfterProceed() {
    const inputsFromRemediation = this.remediation.value || []; // "raw" inputs from server response
    const inputsFromRemediator = this.getInputs(); // "aliased" inputs from SDK remediator
    const inputs = [...inputsFromRemediation, ...inputsFromRemediator];
    // scrub all values related to this remediation
    for (const input of inputs) {
      delete this.values[input.name];
    }
    return this.values;
  }
  getAuthenticator() {
    var _this$remediation$rel, _value$find;
    // relatesTo value may be an authenticator or an authenticatorEnrollment
    const relatesTo = (_this$remediation$rel = this.remediation.relatesTo) === null || _this$remediation$rel === void 0 ? void 0 : _this$remediation$rel.value;
    if (!relatesTo) {
      return;
    }
    const authenticatorFromRemediation = (0, _util.getAuthenticatorFromRemediation)(this.remediation);
    if (!authenticatorFromRemediation) {
      // Hopefully value is an authenticator
      return relatesTo;
    }

    // If relatesTo is an authenticatorEnrollment, the id is actually the enrollmentId
    // Let's get the correct authenticator id from the form value
    const id = authenticatorFromRemediation.form.value.find(({
      name
    }) => name === 'id').value;
    const enrollmentId = (_value$find = authenticatorFromRemediation.form.value.find(({
      name
    }) => name === 'enrollmentId')) === null || _value$find === void 0 ? void 0 : _value$find.value;
    return {
      ...relatesTo,
      id,
      enrollmentId
    };
  }
}
exports.Remediator = Remediator;
//# sourceMappingURL=Remediator.js.map