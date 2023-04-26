"use strict";

exports.WebauthnEnrollment = void 0;
var _Authenticator = require("./Authenticator");
class WebauthnEnrollment extends _Authenticator.Authenticator {
  canVerify(values) {
    const {
      credentials
    } = values;
    const obj = credentials || values;
    const {
      clientData,
      attestation
    } = obj;
    return !!(clientData && attestation);
  }
  mapCredentials(values) {
    const {
      credentials,
      clientData,
      attestation
    } = values;
    if (!credentials && !clientData && !attestation) {
      return;
    }
    return credentials || {
      clientData,
      attestation
    };
  }
  getInputs() {
    return [{
      name: 'clientData',
      type: 'string',
      required: true,
      visible: false,
      label: 'Client Data'
    }, {
      name: 'attestation',
      type: 'string',
      required: true,
      visible: false,
      label: 'Attestation'
    }];
  }
}
exports.WebauthnEnrollment = WebauthnEnrollment;
//# sourceMappingURL=WebauthnEnrollment.js.map