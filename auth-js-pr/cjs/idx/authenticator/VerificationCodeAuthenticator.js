"use strict";

exports.VerificationCodeAuthenticator = void 0;
var _Authenticator = require("./Authenticator");
// general authenticator to handle "verificationCode" input
// it can be used for "email", "phone", "google authenticator"
// a new authenticator class should be created if special cases need to be handled
class VerificationCodeAuthenticator extends _Authenticator.Authenticator {
  canVerify(values) {
    return !!(values.credentials || values.verificationCode || values.otp);
  }
  mapCredentials(values) {
    const {
      credentials,
      verificationCode,
      otp
    } = values;
    if (!credentials && !verificationCode && !otp) {
      return;
    }
    return credentials || {
      passcode: verificationCode || otp
    };
  }
  getInputs(idxRemediationValue) {
    var _idxRemediationValue$;
    return {
      ...((_idxRemediationValue$ = idxRemediationValue.form) === null || _idxRemediationValue$ === void 0 ? void 0 : _idxRemediationValue$.value[0]),
      name: 'verificationCode',
      type: 'string',
      required: idxRemediationValue.required
    };
  }
}
exports.VerificationCodeAuthenticator = VerificationCodeAuthenticator;
//# sourceMappingURL=VerificationCodeAuthenticator.js.map