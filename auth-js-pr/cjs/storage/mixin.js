"use strict";

exports.mixinStorage = mixinStorage;
function mixinStorage(Base, StorageManager) {
  return class OktaAuthStorage extends Base {
    constructor(...args) {
      super(...args);
      const {
        storageManager,
        cookies,
        storageUtil
      } = this.options;
      this.storageManager = new StorageManager(storageManager, cookies, storageUtil);
    }
    clearStorage() {
      // override in subclass
    }
  };
}
//# sourceMappingURL=mixin.js.map