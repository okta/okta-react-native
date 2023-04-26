"use strict";

exports.createEnrollAuthenticatorMeta = createEnrollAuthenticatorMeta;
var _oauth = require("./oauth");
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function createEnrollAuthenticatorMeta(sdk, params) {
  const issuer = sdk.options.issuer;
  const urls = (0, _oauth.getOAuthUrls)(sdk, params);
  const oauthMeta = {
    issuer,
    urls,
    clientId: params.clientId,
    redirectUri: params.redirectUri,
    responseType: params.responseType,
    responseMode: params.responseMode,
    state: params.state,
    acrValues: params.acrValues,
    enrollAmrValues: params.enrollAmrValues
  };
  return oauthMeta;
}
//# sourceMappingURL=enrollAuthenticatorMeta.js.map