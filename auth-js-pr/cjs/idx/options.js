"use strict";

exports.createIdxOptionsConstructor = createIdxOptionsConstructor;
var _options = require("../core/options");
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

function createIdxOptionsConstructor() {
  const CoreOptionsConstructor = (0, _options.createCoreOptionsConstructor)();
  return class IdxOptionsConstructor extends CoreOptionsConstructor {
    // BETA WARNING: configs in this section are subject to change without a breaking change notice

    constructor(options) {
      super(options);
      this.flow = options.flow;
      this.activationToken = options.activationToken;
      this.recoveryToken = options.recoveryToken;
      this.idx = options.idx;
    }
  };
}
//# sourceMappingURL=options.js.map