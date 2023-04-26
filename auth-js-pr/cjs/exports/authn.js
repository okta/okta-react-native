"use strict";

var _exportNames = {
  OktaAuth: true
};
exports.default = exports.OktaAuth = void 0;
var _oidc = require("../oidc");
var _core = require("../core");
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
const OptionsConstructor = (0, _core.createCoreOptionsConstructor)();
const StorageManager = (0, _core.createCoreStorageManager)();
const TransactionManager = (0, _oidc.createTransactionManager)();
const Core = (0, _core.createOktaAuthCore)(StorageManager, OptionsConstructor, TransactionManager);
const WithAuthn = (0, _authn.mixinAuthn)(Core);
class OktaAuth extends WithAuthn {
  constructor(options) {
    super(options);
  }
}
exports.OktaAuth = OktaAuth;
var _default = OktaAuth;
exports.default = _default;
//# sourceMappingURL=authn.js.map