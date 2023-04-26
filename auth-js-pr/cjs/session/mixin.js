"use strict";

exports.mixinSession = mixinSession;
var _factory = require("./factory");
function mixinSession(Base) {
  return class OktaAuthSession extends Base {
    constructor(...args) {
      super(...args);
      this.session = (0, _factory.createSessionApi)(this);
    }

    // Ends the current Okta SSO session without redirecting to Okta.
    closeSession() {
      return this.session.close() // DELETE /api/v1/sessions/me
      .then(async () => {
        // Clear all local tokens
        this.clearStorage();
        return true;
      }).catch(function (e) {
        if (e.name === 'AuthApiError' && e.errorCode === 'E0000007') {
          // Session does not exist or has already been closed
          return false;
        }
        throw e;
      });
    }
  };
}
//# sourceMappingURL=mixin.js.map