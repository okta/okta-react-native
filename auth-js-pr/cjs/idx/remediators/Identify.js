"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.Identify = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Remediator = require("./Base/Remediator");
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

class Identify extends _Remediator.Remediator {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      'identifier': ['username']
    });
  }
  canRemediate() {
    const {
      identifier
    } = this.getData();
    return !!identifier;
  }
  mapCredentials() {
    const {
      credentials,
      password
    } = this.values;
    if (!credentials && !password) {
      return;
    }
    return credentials || {
      passcode: password
    };
  }
  getInputCredentials(input) {
    return {
      ...input.form.value[0],
      name: 'password',
      required: input.required
    };
  }
}
exports.Identify = Identify;
(0, _defineProperty2.default)(Identify, "remediationName", 'identify');
//# sourceMappingURL=Identify.js.map