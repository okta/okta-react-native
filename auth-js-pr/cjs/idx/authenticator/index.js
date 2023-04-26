"use strict";

var _getAuthenticator = require("./getAuthenticator");
Object.keys(_getAuthenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getAuthenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getAuthenticator[key];
    }
  });
});
var _Authenticator = require("./Authenticator");
Object.keys(_Authenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Authenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Authenticator[key];
    }
  });
});
var _VerificationCodeAuthenticator = require("./VerificationCodeAuthenticator");
Object.keys(_VerificationCodeAuthenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _VerificationCodeAuthenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _VerificationCodeAuthenticator[key];
    }
  });
});
var _OktaPassword = require("./OktaPassword");
Object.keys(_OktaPassword).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _OktaPassword[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _OktaPassword[key];
    }
  });
});
var _SecurityQuestionEnrollment = require("./SecurityQuestionEnrollment");
Object.keys(_SecurityQuestionEnrollment).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SecurityQuestionEnrollment[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SecurityQuestionEnrollment[key];
    }
  });
});
var _SecurityQuestionVerification = require("./SecurityQuestionVerification");
Object.keys(_SecurityQuestionVerification).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SecurityQuestionVerification[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SecurityQuestionVerification[key];
    }
  });
});
var _WebauthnEnrollment = require("./WebauthnEnrollment");
Object.keys(_WebauthnEnrollment).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WebauthnEnrollment[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _WebauthnEnrollment[key];
    }
  });
});
var _WebauthnVerification = require("./WebauthnVerification");
Object.keys(_WebauthnVerification).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WebauthnVerification[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _WebauthnVerification[key];
    }
  });
});
//# sourceMappingURL=index.js.map