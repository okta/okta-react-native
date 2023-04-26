"use strict";

var _StorageOptionsConstructor = require("./options/StorageOptionsConstructor");
Object.keys(_StorageOptionsConstructor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _StorageOptionsConstructor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _StorageOptionsConstructor[key];
    }
  });
});
var _BaseStorageManager = require("./BaseStorageManager");
Object.keys(_BaseStorageManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _BaseStorageManager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BaseStorageManager[key];
    }
  });
});
var _mixin = require("./mixin");
Object.keys(_mixin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mixin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mixin[key];
    }
  });
});
var _SavedObject = require("./SavedObject");
Object.keys(_SavedObject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SavedObject[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SavedObject[key];
    }
  });
});
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
//# sourceMappingURL=index.js.map