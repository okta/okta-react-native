"use strict";

exports.createOktaAuthCore = createOktaAuthCore;
var _base = require("../base");
var _mixin = require("../storage/mixin");
var _mixin2 = require("../http/mixin");
var _mixin3 = require("../oidc/mixin");
var _mixin4 = require("./mixin");
var _mixin5 = require("../session/mixin");
function createOktaAuthCore(StorageManagerConstructor, OptionsConstructor, TransactionManagerConstructor) {
  const Base = (0, _base.createOktaAuthBase)(OptionsConstructor);
  const WithStorage = (0, _mixin.mixinStorage)(Base, StorageManagerConstructor);
  const WithHttp = (0, _mixin2.mixinHttp)(WithStorage);
  const WithSession = (0, _mixin5.mixinSession)(WithHttp);
  const WithOAuth = (0, _mixin3.mixinOAuth)(WithSession, TransactionManagerConstructor);
  const Core = (0, _mixin4.mixinCore)(WithOAuth);
  return Core;
}
//# sourceMappingURL=factory.js.map