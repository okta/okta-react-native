"use strict";

var _GenericRemediator = require("./GenericRemediator");
Object.keys(_GenericRemediator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _GenericRemediator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _GenericRemediator[key];
    }
  });
});
//# sourceMappingURL=index.js.map