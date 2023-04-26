"use strict";

exports.SecurityQuestionVerification = void 0;
var _Authenticator = require("./Authenticator");
/* eslint-disable @typescript-eslint/no-non-null-assertion */

class SecurityQuestionVerification extends _Authenticator.Authenticator {
  canVerify(values) {
    const {
      credentials
    } = values;
    if (credentials && credentials.answer) {
      return true;
    }
    const {
      answer
    } = values;
    return !!answer;
  }
  mapCredentials(values) {
    const {
      answer
    } = values;
    if (!answer) {
      return;
    }
    return {
      questionKey: this.meta.contextualData.enrolledQuestion.questionKey,
      answer
    };
  }
  getInputs() {
    return [{
      name: 'answer',
      type: 'string',
      label: 'Answer',
      required: true
    }];
  }
}
exports.SecurityQuestionVerification = SecurityQuestionVerification;
//# sourceMappingURL=SecurityQuestionVerification.js.map