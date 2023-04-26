"use strict";

var _OAuthOptionsConstructor = require("./OAuthOptionsConstructor");
Object.keys(_OAuthOptionsConstructor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _OAuthOptionsConstructor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _OAuthOptionsConstructor[key];
    }
  });
});
//# sourceMappingURL=index.js.map