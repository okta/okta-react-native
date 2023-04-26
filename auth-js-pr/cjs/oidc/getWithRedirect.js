"use strict";

exports.getWithRedirect = getWithRedirect;
var _errors = require("../errors");
var _util = require("../util");
var _util2 = require("./util");
var _authorize = require("./endpoints/authorize");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

async function getWithRedirect(sdk, options) {
  if (arguments.length > 2) {
    return Promise.reject(new _errors.AuthSdkError('As of version 3.0, "getWithRedirect" takes only a single set of options'));
  }
  options = (0, _util.clone)(options) || {};
  const tokenParams = await (0, _util2.prepareTokenParams)(sdk, options);
  const meta = (0, _util2.createOAuthMeta)(sdk, tokenParams);
  const requestUrl = meta.urls.authorizeUrl + (0, _authorize.buildAuthorizeParams)(tokenParams);
  sdk.transactionManager.save(meta);
  if (sdk.options.setLocation) {
    sdk.options.setLocation(requestUrl);
  } else {
    window.location.assign(requestUrl);
  }
}
//# sourceMappingURL=getWithRedirect.js.map