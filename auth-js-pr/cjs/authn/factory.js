"use strict";

exports.createAuthnTransactionAPI = createAuthnTransactionAPI;
var _api = require("./api");
var _AuthnTransactionImpl = require("./AuthnTransactionImpl");
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

// Factory
function createAuthnTransactionAPI(sdk) {
  const tx = {
    status: _api.transactionStatus.bind(null, sdk),
    resume(args) {
      return (0, _api.resumeTransaction)(sdk, tx, args);
    },
    exists: _api.transactionExists.bind(null, sdk),
    introspect(args) {
      return (0, _api.introspectAuthn)(sdk, tx, args);
    },
    createTransaction: res => {
      return new _AuthnTransactionImpl.AuthnTransactionImpl(sdk, tx, res);
    },
    postToTransaction: (url, args, options) => {
      return (0, _api.postToTransaction)(sdk, tx, url, args, options);
    }
  };
  return tx;
}
//# sourceMappingURL=factory.js.map