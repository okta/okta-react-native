"use strict";

var _AutoRenewService = require("./AutoRenewService");
Object.keys(_AutoRenewService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AutoRenewService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AutoRenewService[key];
    }
  });
});
var _SyncStorageService = require("./SyncStorageService");
Object.keys(_SyncStorageService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SyncStorageService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SyncStorageService[key];
    }
  });
});
var _LeaderElectionService = require("./LeaderElectionService");
Object.keys(_LeaderElectionService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _LeaderElectionService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _LeaderElectionService[key];
    }
  });
});
//# sourceMappingURL=index.js.map