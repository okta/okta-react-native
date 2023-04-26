"use strict";

exports.ServiceManager = void 0;
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

class ServiceManager {
  constructor(sdk, options = {}) {
    this.sdk = sdk;
    this.options = options;
  }
  isLeader() {
    return false;
  }
  isLeaderRequired() {
    return false;
  }
  async start() {}
  async stop() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getService(name) {
    return undefined;
  }
}
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=node.js.map