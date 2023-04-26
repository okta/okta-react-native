"use strict";

exports.createSessionApi = createSessionApi;
var _api = require("./api");
function createSessionApi(sdk) {
  const session = {
    close: _api.closeSession.bind(null, sdk),
    exists: _api.sessionExists.bind(null, sdk),
    get: _api.getSession.bind(null, sdk),
    refresh: _api.refreshSession.bind(null, sdk),
    setCookieAndRedirect: _api.setCookieAndRedirect.bind(null, sdk)
  };
  return session;
}
//# sourceMappingURL=factory.js.map