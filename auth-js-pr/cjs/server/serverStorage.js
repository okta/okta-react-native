"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.default = void 0;
var _nodeCache = _interopRequireDefault(require("node-cache"));
var _errors = require("../errors");
/*!
 * Copyright (c) 2018-present, Okta, Inc. and/or its affiliates. All rights reserved.
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
// Do not use this type in code, so it won't be emitted in the declaration output

// eslint-disable-next-line import/no-commonjs

// this is a SHARED memory storage to support a stateless http server
const sharedStorage = typeof _nodeCache.default === 'function' ? new _nodeCache.default() : null;
class ServerCookies {
  // NodeCache

  constructor(nodeCache) {
    this.nodeCache = nodeCache;
  }
  set(name, value, expiresAt) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!Date.parse(expiresAt)) {
      // Time to expiration in seconds
      var ttl = (Date.parse(expiresAt) - Date.now()) / 1000;
      this.nodeCache.set(name, value, ttl);
    } else {
      this.nodeCache.set(name, value);
    }
    return this.get(name);
  }
  get(name) {
    return this.nodeCache.get(name);
  }
  delete(name) {
    return this.nodeCache.del(name);
  }
}
// Building this as an object allows us to mock the functions in our tests
class ServerStorage {
  // NodeCache

  constructor(nodeCache) {
    this.nodeCache = nodeCache;
    this.storage = new ServerCookies(nodeCache);
  }
  testStorageType(storageType) {
    var supported = false;
    switch (storageType) {
      case 'memory':
        supported = true;
        break;
      default:
        break;
    }
    return supported;
  }
  getStorageByType(storageType) {
    let storageProvider;
    switch (storageType) {
      case 'memory':
        storageProvider = this.getStorage();
        break;
      default:
        throw new _errors.AuthSdkError(`Unrecognized storage option: ${storageType}`);
        break;
    }
    return storageProvider;
  }
  findStorageType() {
    return 'memory';
  }

  // shared in-memory using node cache
  getStorage() {
    return {
      getItem: this.nodeCache.get,
      setItem: (key, value) => {
        this.nodeCache.set(key, value, '2200-01-01T00:00:00.000Z');
      }
    };
  }
}
var _default = new ServerStorage(sharedStorage);
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=serverStorage.js.map