"use strict";

var _exportNames = {
  OktaAuth: true
};
exports.default = exports.OktaAuth = void 0;
var _oidc = require("../oidc");
var _core = require("../core");
var _myaccount = require("../myaccount");
Object.keys(_myaccount).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _myaccount[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _myaccount[key];
    }
  });
});
var _common = require("./common");
Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});
const OptionsConstructor = (0, _core.createCoreOptionsConstructor)();
const StorageManager = (0, _core.createCoreStorageManager)();
const TransactionManager = (0, _oidc.createTransactionManager)();
const OktaAuthMyAccount = (0, _myaccount.createOktaAuthMyAccount)(StorageManager, OptionsConstructor, TransactionManager);
class OktaAuth extends OktaAuthMyAccount {
  constructor(options) {
    super(options);
  }
}
exports.OktaAuth = OktaAuth;
var _default = OktaAuth;
exports.default = _default;
//# sourceMappingURL=myaccount.js.map