"use strict";

exports.createOktaAuthIdx = createOktaAuthIdx;
var _factory = require("../../core/factory");
var _mixin = require("../mixin");
function createOktaAuthIdx(StorageManagerConstructor, OptionsConstructor, TransactionManagerConstructor) {
  const Core = (0, _factory.createOktaAuthCore)(StorageManagerConstructor, OptionsConstructor, TransactionManagerConstructor);
  const WithIdx = (0, _mixin.mixinIdx)(Core);
  return WithIdx;
}
//# sourceMappingURL=OktaAuthIdx.js.map