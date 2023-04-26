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
const OktaAuthIdx = (0, _idx.createOktaAuthIdx)(StorageManager, OptionsConstructor, TransactionManager);

// eslint-disable-next-line @typescript-eslint/no-empty-interface

class OktaAuth extends OktaAuthIdx {
  constructor(options) {
    super(options);
  }
}
exports.OktaAuth = OktaAuth;
var _default = OktaAuth;
exports.default = _default;
//# sourceMappingURL=idx.js.map