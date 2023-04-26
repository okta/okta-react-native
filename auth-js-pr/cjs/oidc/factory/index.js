"use strict";

var _api = require("./api");
Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api[key];
    }
  });
});
var _OktaAuthOAuth = require("./OktaAuthOAuth");
Object.keys(_OktaAuthOAuth).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _OktaAuthOAuth[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _OktaAuthOAuth[key];
    }
  });
});
//# sourceMappingURL=index.js.map