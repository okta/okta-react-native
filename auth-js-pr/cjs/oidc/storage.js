"use strict";

exports.createOAuthStorageManager = createOAuthStorageManager;
var _BaseStorageManager = require("../storage/BaseStorageManager");
var _storage = require("../storage");
var _constants = require("../constants");
function createOAuthStorageManager() {
  return class OAuthStorageManager extends _BaseStorageManager.BaseStorageManager {
    constructor(storageManagerOptions, cookieOptions, storageUtil) {
      super(storageManagerOptions, cookieOptions, storageUtil);
    }
    getTransactionStorage(options) {
      options = this.getOptionsForSection('transaction', options);
      (0, _BaseStorageManager.logServerSideMemoryStorageWarning)(options);
      const storage = this.getStorage(options);
      const storageKey = options.storageKey || _constants.TRANSACTION_STORAGE_NAME;
      return new _storage.SavedObject(storage, storageKey);
    }
    getSharedTansactionStorage(options) {
      options = this.getOptionsForSection('shared-transaction', options);
      (0, _BaseStorageManager.logServerSideMemoryStorageWarning)(options);
      const storage = this.getStorage(options);
      const storageKey = options.storageKey || _constants.SHARED_TRANSACTION_STORAGE_NAME;
      return new _storage.SavedObject(storage, storageKey);
    }
    getOriginalUriStorage(options) {
      options = this.getOptionsForSection('original-uri', options);
      (0, _BaseStorageManager.logServerSideMemoryStorageWarning)(options);
      const storage = this.getStorage(options);
      const storageKey = options.storageKey || _constants.ORIGINAL_URI_STORAGE_NAME;
      return new _storage.SavedObject(storage, storageKey);
    }
  };
}
//# sourceMappingURL=storage.js.map