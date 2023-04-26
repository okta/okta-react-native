"use strict";

var _exportNames = {
  OktaAuth: true
};
exports.default = exports.OktaAuth = void 0;
var _idx = require("../idx");
Object.keys(_idx).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _idx[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _idx[key];
    }
  });
});
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
var _authn = require("../authn");
Object.keys(_authn).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authn[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authn[key];
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
const OptionsConstructor = (0, _idx.createIdxOptionsConstructor)();
const StorageManager = (0, _idx.createIdxStorageManager)();
const TransactionManager = (0, _idx.createIdxTransactionManager)();

// Default bundle includes everything
const WithIdx = (0, _idx.createOktaAuthIdx)(StorageManager, OptionsConstructor, TransactionManager);
const WithMyAccount = (0, _myaccount.mixinMyAccount)(WithIdx);
const WithAuthn = (0, _authn.mixinAuthn)(WithMyAccount);
class OktaAuth extends WithAuthn {
  constructor(options) {
    super(options);
  }
}
exports.OktaAuth = OktaAuth;
var _default = OktaAuth;
exports.default = _default;
//# sourceMappingURL=default.js.map