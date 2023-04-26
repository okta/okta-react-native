"use strict";

exports.createOktaAuthOAuth = createOktaAuthOAuth;
var _base = require("../../base");
var _mixin = require("../../storage/mixin");
var _mixin2 = require("../../session/mixin");
var _mixin3 = require("../../http/mixin");
var _mixin4 = require("../mixin");
function createOktaAuthOAuth(StorageManagerConstructor, OptionsConstructor, TransactionManagerConstructor) {
  const Base = (0, _base.createOktaAuthBase)(OptionsConstructor);
  const WithStorage = (0, _mixin.mixinStorage)(Base, StorageManagerConstructor);
  const WithHttp = (0, _mixin3.mixinHttp)(WithStorage);
  const WithSession = (0, _mixin2.mixinSession)(WithHttp);
  const WithOAuth = (0, _mixin4.mixinOAuth)(WithSession, TransactionManagerConstructor);
  return WithOAuth;
}
//# sourceMappingURL=OktaAuthOAuth.js.map