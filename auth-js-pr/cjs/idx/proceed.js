"use strict";

exports.canProceed = canProceed;
exports.proceed = proceed;
var _run = require("./run");
var _transactionMeta = require("./transactionMeta");
var _errors = require("../errors");
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
 */

function canProceed(authClient, options = {}) {
  const meta = (0, _transactionMeta.getSavedTransactionMeta)(authClient, options);
  return !!(meta || options.stateHandle);
}
async function proceed(authClient, options = {}) {
  if (!canProceed(authClient, options)) {
    throw new _errors.AuthSdkError('Unable to proceed: saved transaction could not be loaded');
  }
  let {
    flow,
    state
  } = options;
  if (!flow) {
    const meta = (0, _transactionMeta.getSavedTransactionMeta)(authClient, {
      state
    });
    flow = meta === null || meta === void 0 ? void 0 : meta.flow;
  }
  return (0, _run.run)(authClient, {
    ...options,
    flow
  });
}
//# sourceMappingURL=proceed.js.map