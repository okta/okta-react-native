"use strict";

var _exportNames = {
  OktaAuth: true
};
exports.default = exports.OktaAuth = void 0;
var _oidc = require("../oidc");
var _core = require("../core");
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
const _OptionsConstructor = (0, _core.createCoreOptionsConstructor)();
const StorageManager = (0, _core.createCoreStorageManager)();
const TransactionManager = (0, _oidc.createTransactionManager)();
const OktaAuthCore = (0, _core.createOktaAuthCore)(StorageManager, _OptionsConstructor, TransactionManager);
class OktaAuth extends OktaAuthCore {
  constructor(options) {
    super(options);
  }
}
exports.OktaAuth = OktaAuth;
var _default = OktaAuth;
exports.default = _default;
//# sourceMappingURL=core.js.map