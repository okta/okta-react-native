"use strict";

exports.OktaPassword = void 0;
var _Authenticator = require("./Authenticator");
class OktaPassword extends _Authenticator.Authenticator {
  canVerify(values) {
    return !!(values.credentials || values.password || values.passcode);
  }
  mapCredentials(values) {
    const {
      credentials,
      password,
      passcode
    } = values;
    if (!credentials && !password && !passcode) {
      return;
    }
    return credentials || {
      passcode: passcode || password
    };
  }
  getInputs(idxRemediationValue) {
    var _idxRemediationValue$;
    return {
      ...((_idxRemediationValue$ = idxRemediationValue.form) === null || _idxRemediationValue$ === void 0 ? void 0 : _idxRemediationValue$.value[0]),
      name: 'password',
      type: 'string',
      required: idxRemediationValue.required
    };
  }
}
exports.OktaPassword = OktaPassword;
//# sourceMappingURL=OktaPassword.js.map