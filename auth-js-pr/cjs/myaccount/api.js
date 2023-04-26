"use strict";

var _profileApi = require("./profileApi");
Object.keys(_profileApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _profileApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _profileApi[key];
    }
  });
});
var _emailApi = require("./emailApi");
Object.keys(_emailApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _emailApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _emailApi[key];
    }
  });
});
var _phoneApi = require("./phoneApi");
Object.keys(_phoneApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _phoneApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _phoneApi[key];
    }
  });
});
var _passwordApi = require("./passwordApi");
Object.keys(_passwordApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _passwordApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _passwordApi[key];
    }
  });
});
//# sourceMappingURL=api.js.map