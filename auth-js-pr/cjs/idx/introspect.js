"use strict";

exports.introspect = introspect;
var _idxState = require("./idxState");
var _idxJs = require("./types/idx-js");
var _oidc = require("../oidc");
var _constants = require("../constants");
var _http = require("../http");
var _errors = require("../errors");
/* eslint-disable complexity */
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

async function introspect(authClient, options = {}) {
  let rawIdxResponse;
  let requestDidSucceed;

  // try load from storage first
  const savedIdxResponse = authClient.transactionManager.loadIdxResponse(options);
  if (savedIdxResponse) {
    rawIdxResponse = savedIdxResponse.rawIdxResponse;
    requestDidSucceed = savedIdxResponse.requestDidSucceed;
  }

  // call idx.introspect if no existing idx response available in storage
  if (!rawIdxResponse) {
    const version = options.version || _constants.IDX_API_VERSION;
    const domain = (0, _oidc.getOAuthDomain)(authClient);
    const {
      interactionHandle,
      stateHandle
    } = options;
    const withCredentials = options.withCredentials ?? true;
    try {
      requestDidSucceed = true;
      (0, _idxState.validateVersionConfig)(version);
      const url = `${domain}/idp/idx/introspect`;
      const body = stateHandle ? {
        stateToken: stateHandle
      } : {
        interactionHandle
      };
      const headers = {
        'Content-Type': `application/ion+json; okta-version=${version}`,
        // Server wants this version info
        Accept: `application/ion+json; okta-version=${version}`
      };
      rawIdxResponse = await (0, _http.httpRequest)(authClient, {
        method: 'POST',
        url,
        headers,
        withCredentials,
        args: body
      });
    } catch (err) {
      if ((0, _errors.isAuthApiError)(err) && err.xhr && (0, _idxJs.isRawIdxResponse)(err.xhr.responseJSON)) {
        rawIdxResponse = err.xhr.responseJSON;
        requestDidSucceed = false;
      } else {
        throw err;
      }
    }
  }
  const {
    withCredentials
  } = options;
  return (0, _idxState.makeIdxState)(authClient, rawIdxResponse, {
    withCredentials
  }, requestDidSucceed);
}
//# sourceMappingURL=introspect.js.map