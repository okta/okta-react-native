"use strict";

exports.interact = interact;
var _transactionMeta = require("./transactionMeta");
var _oidc = require("../oidc");
var _util = require("../util");
var _http = require("../http");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
/* eslint complexity:[0,8] */

/* eslint-enable camelcase */

function getResponse(meta) {
  return {
    meta,
    interactionHandle: meta.interactionHandle,
    state: meta.state
  };
}

// Begin or resume a transaction. Returns an interaction handle
async function interact(authClient, options = {}) {
  var _meta;
  options = (0, _util.removeNils)(options);
  let meta = (0, _transactionMeta.getSavedTransactionMeta)(authClient, options);
  // If meta exists, it has been validated against all options

  if ((_meta = meta) !== null && _meta !== void 0 && _meta.interactionHandle) {
    return getResponse(meta); // Saved transaction, return meta
  }

  // Create new meta, respecting previous meta if it has been set and is not overridden
  meta = await (0, _transactionMeta.createTransactionMeta)(authClient, {
    ...meta,
    ...options
  });
  const baseUrl = (0, _oidc.getOAuthBaseUrl)(authClient);
  let {
    clientId,
    redirectUri,
    state,
    scopes,
    withCredentials,
    codeChallenge,
    codeChallengeMethod,
    activationToken,
    recoveryToken,
    maxAge,
    acrValues,
    nonce
  } = meta;
  const clientSecret = options.clientSecret || authClient.options.clientSecret;
  withCredentials = withCredentials ?? true;

  /* eslint-disable camelcase */
  const url = `${baseUrl}/v1/interact`;
  const params = {
    client_id: clientId,
    scope: scopes.join(' '),
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
    state,
    ...(activationToken && {
      activation_token: activationToken
    }),
    ...(recoveryToken && {
      recovery_token: recoveryToken
    }),
    // X-Device-Token header need to pair with `client_secret`
    // eslint-disable-next-line max-len
    // https://oktawiki.atlassian.net/wiki/spaces/eng/pages/2445902453/Support+Device+Binding+in+interact#Scenario-1%3A-Non-User-Agent-with-Confidential-Client-(top-priority)
    ...(clientSecret && {
      client_secret: clientSecret
    }),
    ...(maxAge && {
      max_age: maxAge
    }),
    ...(acrValues && {
      acr_values: acrValues
    }),
    ...(nonce && {
      nonce
    })
  };
  /* eslint-enable camelcase */

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const resp = await (0, _http.httpRequest)(authClient, {
    method: 'POST',
    url,
    headers,
    withCredentials,
    args: params
  });
  const interactionHandle = resp.interaction_handle;
  const newMeta = {
    ...meta,
    interactionHandle,
    // Options which can be passed into interact() should be saved in the meta
    withCredentials,
    state,
    scopes,
    recoveryToken,
    activationToken
  };
  // Save transaction meta so it can be resumed
  (0, _transactionMeta.saveTransactionMeta)(authClient, newMeta);
  return getResponse(newMeta);
}
//# sourceMappingURL=interact.js.map