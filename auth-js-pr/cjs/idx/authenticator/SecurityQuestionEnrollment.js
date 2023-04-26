"use strict";

exports.SecurityQuestionEnrollment = void 0;
var _Authenticator = require("./Authenticator");
class SecurityQuestionEnrollment extends _Authenticator.Authenticator {
  canVerify(values) {
    const {
      credentials
    } = values;
    if (credentials && credentials.questionKey && credentials.answer) {
      return true;
    }
    const {
      questionKey,
      question,
      answer
    } = values;
    return !!(questionKey && answer) || !!(question && answer);
  }
  mapCredentials(values) {
    const {
      questionKey,
      question,
      answer
    } = values;
    if (!answer || !questionKey && !question) {
      return;
    }
    return {
      questionKey: question ? 'custom' : questionKey,
      question,
      answer
    };
  }
  getInputs() {
    return [{
      name: 'questionKey',
      type: 'string',
      required: true
    }, {
      name: 'question',
      type: 'string',
      label: 'Create a security question'
    }, {
      name: 'answer',
      type: 'string',
      label: 'Answer',
      required: true
    }];
  }
}
exports.SecurityQuestionEnrollment = SecurityQuestionEnrollment;
//# sourceMappingURL=SecurityQuestionEnrollment.js.map