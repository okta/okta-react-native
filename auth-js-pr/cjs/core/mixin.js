"use strict";

exports.mixinCore = mixinCore;
var _parseFromUrl = require("../oidc/parseFromUrl");
var _AuthStateManager = require("./AuthStateManager");
var _ServiceManager = require("./ServiceManager");
function mixinCore(Base) {
  return class OktaAuthCore extends Base {
    constructor(...args) {
      super(...args);

      // AuthStateManager
      this.authStateManager = new _AuthStateManager.AuthStateManager(this);

      // ServiceManager
      this.serviceManager = new _ServiceManager.ServiceManager(this, this.options.services);
    }
    async start() {
      await this.serviceManager.start();
      // TODO: review tokenManager.start
      this.tokenManager.start();
      if (!this.token.isLoginRedirect()) {
        await this.authStateManager.updateAuthState();
      }
    }
    async stop() {
      // TODO: review tokenManager.stop
      this.tokenManager.stop();
      await this.serviceManager.stop();
    }
    async handleRedirect(originalUri) {
      await this.handleLoginRedirect(undefined, originalUri);
    }

    // eslint-disable-next-line complexity
    async handleLoginRedirect(tokens, originalUri) {
      let state = this.options.state;

      // Store tokens and update AuthState by the emitted events
      if (tokens) {
        this.tokenManager.setTokens(tokens);
        originalUri = originalUri || this.getOriginalUri(this.options.state);
      } else if (this.isLoginRedirect()) {
        try {
          // For redirect flow, get state from the URL and use it to retrieve the originalUri
          const oAuthResponse = await (0, _parseFromUrl.parseOAuthResponseFromUrl)(this, {});
          state = oAuthResponse.state;
          originalUri = originalUri || this.getOriginalUri(state);
          await this.storeTokensFromRedirect();
        } catch (e) {
          // auth state should be updated
          await this.authStateManager.updateAuthState();
          throw e;
        }
      } else {
        return; // nothing to do
      }

      // ensure auth state has been updated
      await this.authStateManager.updateAuthState();

      // clear originalUri from storage
      this.removeOriginalUri(state);

      // Redirect to originalUri
      const {
        restoreOriginalUri
      } = this.options;
      if (restoreOriginalUri) {
        await restoreOriginalUri(this, originalUri);
      } else if (originalUri) {
        window.location.replace(originalUri);
      }
    }
  };
}
//# sourceMappingURL=mixin.js.map