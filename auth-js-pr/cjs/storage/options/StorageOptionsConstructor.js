"use strict";

exports.createStorageOptionsConstructor = createStorageOptionsConstructor;
var _base = require("../../base");
var _node = require("./node");
var _features = require("../../features");
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

function createStorageOptionsConstructor() {
  const BaseOptionsConstructor = (0, _base.createBaseOptionsConstructor)();
  return class StorageOptionsConstructor extends BaseOptionsConstructor {
    constructor(args) {
      super(args);
      this.cookies = (0, _node.getCookieSettings)(args, (0, _features.isHTTPS)());
      this.storageUtil = args.storageUtil || (0, _node.getStorage)();
      this.storageManager = {
        ..._node.STORAGE_MANAGER_OPTIONS,
        ...args.storageManager
      };
    }
  };
}
//# sourceMappingURL=StorageOptionsConstructor.js.map