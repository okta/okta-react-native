"use strict";

exports.createCoreStorageManager = createCoreStorageManager;
var _storage = require("../oidc/storage");
function createCoreStorageManager() {
  return (0, _storage.createOAuthStorageManager)();
}
//# sourceMappingURL=storage.js.map