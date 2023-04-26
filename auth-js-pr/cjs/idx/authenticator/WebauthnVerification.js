"use strict";

exports.WebauthnVerification = void 0;
var _Authenticator = require("./Authenticator");
class WebauthnVerification extends _Authenticator.Authenticator {
  canVerify(values) {
    const {
      credentials
    } = values;
    const obj = credentials || values;
    const {
      clientData,
      authenticatorData,
      signatureData
    } = obj;
    return !!(clientData && authenticatorData && signatureData);
  }
  mapCredentials(values) {
    const {
      credentials,
      authenticatorData,
      clientData,
      signatureData
    } = values;
    if (!credentials && !authenticatorData && !clientData && !signatureData) {
      return;
    }
    return credentials || {
      authenticatorData,
      clientData,
      signatureData
    };
  }
  getInputs() {
    return [{
      name: 'authenticatorData',
      type: 'string',
      label: 'Authenticator Data',
      required: true,
      visible: false
    }, {
      name: 'clientData',
      type: 'string',
      label: 'Client Data',
      required: true,
      visible: false
    }, {
      name: 'signatureData',
      type: 'string',
      label: 'Signature Data',
      required: true,
      visible: false
    }];
  }
}
exports.WebauthnVerification = WebauthnVerification;
//# sourceMappingURL=WebauthnVerification.js.map