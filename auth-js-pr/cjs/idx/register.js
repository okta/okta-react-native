"use strict";

exports.register = register;
var _run = require("./run");
var _transactionMeta = require("./transactionMeta");
var _startTransaction = require("./startTransaction");
var _errors = require("../errors");
var _types = require("./types");
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

async function register(authClient, options = {}) {
  // Only check at the beginning of the transaction
  if (!(0, _transactionMeta.hasSavedInteractionHandle)(authClient)) {
    const {
      enabledFeatures
    } = await (0, _startTransaction.startTransaction)(authClient, {
      ...options,
      flow: 'register',
      autoRemediate: false
    });
    if (!options.activationToken && enabledFeatures && !enabledFeatures.includes(_types.IdxFeature.REGISTRATION)) {
      throw new _errors.AuthSdkError('Registration is not supported based on your current org configuration.');
    }
  }
  return (0, _run.run)(authClient, {
    ...options,
    flow: 'register'
  });
}
//# sourceMappingURL=register.js.map