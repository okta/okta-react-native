"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.provideOriginalUri = provideOriginalUri;
var _constants = require("../../constants");
var _browserStorage = _interopRequireDefault(require("../../browser/browserStorage"));
function provideOriginalUri(BaseClass) {
  return class WithOriginalUri extends BaseClass {
    setOriginalUri(originalUri, state) {
      // always store in session storage
      const sessionStorage = _browserStorage.default.getSessionStorage();
      sessionStorage.setItem(_constants.REFERRER_PATH_STORAGE_KEY, originalUri);

      // to support multi-tab flows, set a state in constructor or pass as param
      state = state || this.options.state;
      if (state) {
        const sharedStorage = this.storageManager.getOriginalUriStorage();
        sharedStorage.setItem(state, originalUri);
      }
    }
    getOriginalUri(state) {
      // Prefer shared storage (if state is available)
      state = state || this.options.state;
      if (state) {
        const sharedStorage = this.storageManager.getOriginalUriStorage();
        const originalUri = sharedStorage.getItem(state);
        if (originalUri) {
          return originalUri;
        }
      }

      // Try to load from session storage
      const storage = _browserStorage.default.getSessionStorage();
      return storage ? storage.getItem(_constants.REFERRER_PATH_STORAGE_KEY) || undefined : undefined;
    }
    removeOriginalUri(state) {
      // Remove from sessionStorage
      const storage = _browserStorage.default.getSessionStorage();
      storage.removeItem(_constants.REFERRER_PATH_STORAGE_KEY);

      // Also remove from shared storage
      state = state || this.options.state;
      if (state) {
        const sharedStorage = this.storageManager.getOriginalUriStorage();
        sharedStorage.removeItem && sharedStorage.removeItem(state);
      }
    }
  };
}
//# sourceMappingURL=browser.js.map