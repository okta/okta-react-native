"use strict";

exports.createOktaAuthMyAccount = createOktaAuthMyAccount;
var _factory = require("../core/factory");
var _mixin = require("./mixin");
function createOktaAuthMyAccount(StorageManagerConstructor, OptionsConstructor, TransactionManager) {
  const Core = (0, _factory.createOktaAuthCore)(StorageManagerConstructor, OptionsConstructor, TransactionManager);
  const WithMyAccount = (0, _mixin.mixinMyAccount)(Core);
  return WithMyAccount;
}
//# sourceMappingURL=factory.js.map