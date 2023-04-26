"use strict";

exports.createOAuthMeta = createOAuthMeta;
var _oauth = require("./oauth");
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function createOAuthMeta(sdk, tokenParams) {
  const issuer = sdk.options.issuer;
  const urls = (0, _oauth.getOAuthUrls)(sdk, tokenParams);
  const oauthMeta = {
    issuer,
    urls,
    clientId: tokenParams.clientId,
    redirectUri: tokenParams.redirectUri,
    responseType: tokenParams.responseType,
    responseMode: tokenParams.responseMode,
    scopes: tokenParams.scopes,
    state: tokenParams.state,
    nonce: tokenParams.nonce,
    ignoreSignature: tokenParams.ignoreSignature,
    acrValues: tokenParams.acrValues
  };
  if (tokenParams.pkce === false) {
    // Implicit flow or authorization_code without PKCE
    return oauthMeta;
  }
  const pkceMeta = {
    ...oauthMeta,
    codeVerifier: tokenParams.codeVerifier,
    codeChallengeMethod: tokenParams.codeChallengeMethod,
    codeChallenge: tokenParams.codeChallenge
  };
  return pkceMeta;
}
//# sourceMappingURL=oauthMeta.js.map