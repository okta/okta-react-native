"use strict";

exports.GenericRemediator = void 0;
var _Remediator = require("../Base/Remediator");
var _util = require("./util");
class GenericRemediator extends _Remediator.Remediator {
  canRemediate() {
    // only handle remediations that are able to submit form (xhr)
    if (typeof this.remediation.action !== 'function') {
      return false;
    }

    // DO NOT REMOVE - bring it back when enable client side validation for GenericRemediator - OKTA-512003
    // const inputs = this.getInputs();
    // const res = inputs.reduce((acc, input) => {
    //   return acc && hasValidInputValue(input, this.values);
    // }, true);
    // return res;

    if (this.remediation.name === 'poll' || this.remediation.name.endsWith('-poll')) {
      return true;
    }
    if (this.options.step) {
      return true;
    }

    // disable auto proceed for unknown remediations
    return false;
  }
  getData() {
    const data = this.getInputs().reduce((acc, {
      name
    }) => {
      acc[name] = this.values[name];
      return acc;
    }, {});
    return data;
  }
  getNextStep(authClient, _context) {
    const name = this.getName();
    const inputs = this.getInputs();

    /* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
    // excludes transformed fields
    const {
      // http metas have been transformed to action
      href,
      method,
      rel,
      accepts,
      produces,
      // value has been transform to inputs
      value,
      // will be transformed to a function that resolves IdxTransaction
      action,
      ...rest
    } = this.remediation;
    /* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars */

    // step to handle form submission
    if (action) {
      return {
        ...rest,
        ...(!!inputs.length && {
          inputs
        }),
        action: async params => {
          return authClient.idx.proceed({
            step: name,
            ...params
          });
        }
      };
    }

    // return whole remediation data for other steps, eg "redirect-idp"
    return {
      ...this.remediation
    };
  }
  getInputs() {
    return (this.remediation.value || []).filter(({
      name
    }) => name !== 'stateHandle').map(_util.unwrapFormValue).map(input => {
      // use string as default input type
      input.type = input.type || 'string';
      return input;
    });
  }
}
exports.GenericRemediator = GenericRemediator;
//# sourceMappingURL=GenericRemediator.js.map