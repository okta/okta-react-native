"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.STORAGE_MANAGER_OPTIONS = void 0;
exports.getCookieSettings = getCookieSettings;
exports.getStorage = getStorage;
var _serverStorage = _interopRequireDefault(require("../../server/serverStorage"));
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

function getStorage() {
  return _serverStorage.default;
}
const STORAGE_MANAGER_OPTIONS = {
  token: {
    storageTypes: ['memory']
  },
  cache: {
    storageTypes: ['memory']
  },
  transaction: {
    storageTypes: ['memory']
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
exports.STORAGE_MANAGER_OPTIONS = STORAGE_MANAGER_OPTIONS;
function getCookieSettings(args = {}, isHTTPS) {
  return args.cookies;
}
//# sourceMappingURL=node.js.map