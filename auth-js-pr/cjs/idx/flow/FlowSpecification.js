"use strict";

exports.getFlowSpecification = getFlowSpecification;
var _AuthenticationFlow = require("./AuthenticationFlow");
var _PasswordRecoveryFlow = require("./PasswordRecoveryFlow");
var _RegistrationFlow = require("./RegistrationFlow");
var _AccountUnlockFlow = require("./AccountUnlockFlow");
// eslint-disable-next-line complexity
function getFlowSpecification(oktaAuth, flow = 'default') {
  let remediators,
    actions,
    withCredentials = true;
  switch (flow) {
    case 'register':
    case 'signup':
    case 'enrollProfile':
      remediators = _RegistrationFlow.RegistrationFlow;
      withCredentials = false;
      break;
    case 'recoverPassword':
    case 'resetPassword':
      remediators = _PasswordRecoveryFlow.PasswordRecoveryFlow;
      actions = ['currentAuthenticator-recover', 'currentAuthenticatorEnrollment-recover'];
      withCredentials = false;
      break;
    case 'unlockAccount':
      remediators = _AccountUnlockFlow.AccountUnlockFlow;
      withCredentials = false;
      actions = ['unlock-account'];
      break;
    case 'authenticate':
    case 'login':
    case 'signin':
      remediators = _AuthenticationFlow.AuthenticationFlow;
      break;
    default:
      // default case has no flow monitor
      remediators = _AuthenticationFlow.AuthenticationFlow;
      break;
  }
  return {
    flow,
    remediators,
    actions,
    withCredentials
  };
}
//# sourceMappingURL=FlowSpecification.js.map