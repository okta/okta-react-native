"use strict";

exports.provideOriginalUri = provideOriginalUri;
function provideOriginalUri(BaseClass)
//: TBase & OktaAuthConstructor<O, I & OriginalUriApi>
{
  return class NodeOriginalUri extends BaseClass {
    setOriginalUri(originalUri, state) {
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
    }
    removeOriginalUri(state) {
      // remove from shared storage
      state = state || this.options.state;
      if (state) {
        const sharedStorage = this.storageManager.getOriginalUriStorage();
        sharedStorage.removeItem && sharedStorage.removeItem(state);
      }
    }
  };
}
//# sourceMappingURL=node.js.map