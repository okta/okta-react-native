"use strict";

exports.cancel = cancel;
var _run = require("./run");
var _flow = require("./flow");
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

async function cancel(authClient, options) {
  const meta = authClient.transactionManager.load();
  const flowSpec = (0, _flow.getFlowSpecification)(authClient, meta.flow);
  return (0, _run.run)(authClient, {
    ...options,
    ...flowSpec,
    actions: ['cancel']
  });
}
//# sourceMappingURL=cancel.js.map