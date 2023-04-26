"use strict";

exports.OktaVerifyTotp = void 0;
var _VerificationCodeAuthenticator = require("./VerificationCodeAuthenticator");
class OktaVerifyTotp extends _VerificationCodeAuthenticator.VerificationCodeAuthenticator {
  mapCredentials(values) {
    const {
      verificationCode
    } = values;
    if (!verificationCode) {
      return;
    }
    return {
      totp: verificationCode
    };
  }
}
exports.OktaVerifyTotp = OktaVerifyTotp;
//# sourceMappingURL=OktaVerifyTotp.js.map