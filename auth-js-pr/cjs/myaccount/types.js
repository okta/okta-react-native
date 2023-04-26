"use strict";

Object.defineProperty(exports, "BaseTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.BaseTransaction;
  }
});
Object.defineProperty(exports, "EmailChallengeTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.EmailChallengeTransaction;
  }
});
exports.EmailRole = void 0;
Object.defineProperty(exports, "EmailStatusTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.EmailStatusTransaction;
  }
});
Object.defineProperty(exports, "EmailTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.EmailTransaction;
  }
});
exports.PasswordStatus = void 0;
Object.defineProperty(exports, "PasswordTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.PasswordTransaction;
  }
});
Object.defineProperty(exports, "PhoneTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.PhoneTransaction;
  }
});
Object.defineProperty(exports, "ProfileSchemaTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.ProfileSchemaTransaction;
  }
});
Object.defineProperty(exports, "ProfileTransaction", {
  enumerable: true,
  get: function () {
    return _transactions.ProfileTransaction;
  }
});
exports.Status = void 0;
var _transactions = require("./transactions");
let EmailRole;
exports.EmailRole = EmailRole;
(function (EmailRole) {
  EmailRole["PRIMARY"] = "PRIMARY";
  EmailRole["SECONDARY"] = "SECONDARY";
})(EmailRole || (exports.EmailRole = EmailRole = {}));
let Status;
exports.Status = Status;
(function (Status) {
  Status["VERIFIED"] = "VERIFIED";
  Status["UNVERIFIED"] = "UNVERIFIED";
})(Status || (exports.Status = Status = {}));
let PasswordStatus;
exports.PasswordStatus = PasswordStatus;
(function (PasswordStatus) {
  PasswordStatus["NOT_ENROLLED"] = "NOT_ENROLLED";
  PasswordStatus["ACTIVE"] = "ACTIVE";
})(PasswordStatus || (exports.PasswordStatus = PasswordStatus = {}));
//# sourceMappingURL=types.js.map