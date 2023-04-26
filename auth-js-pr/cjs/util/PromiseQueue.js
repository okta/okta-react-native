"use strict";

exports.PromiseQueue = void 0;
var _types = require("./types");
var _console = require("./console");
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

// Implements a queue for synchronous or asynchronous methods
// Methods will be wrapped in a promise and execute sequentially
// This can be used to prevent concurrent calls to a single method or a set of methods

class PromiseQueue {
  constructor(options = {
    quiet: false
  }) {
    this.queue = [];
    this.running = false;
    this.options = options;
  }

  // Returns a promise
  // If the method is synchronous, it will resolve when the method completes
  // If the method returns a promise, it will resolve (or reject) with the value from the method's promise
  push(method, thisObject, ...args) {
    return new Promise((resolve, reject) => {
      if (this.queue.length > 0) {
        // There is at least one other pending call.
        // The PromiseQueue will prevent these methods from running concurrently.
        if (this.options.quiet !== false) {
          (0, _console.warn)('Async method is being called but another async method is already running. ' + 'The new method will be delayed until the previous method completes.');
        }
      }
      this.queue.push({
        method,
        thisObject,
        args,
        resolve,
        reject
      });
      this.run();
    });
  }
  run() {
    if (this.running) {
      return;
    }
    if (this.queue.length === 0) {
      return;
    }
    this.running = true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var queueItem = this.queue.shift();
    var res = queueItem.method.apply(queueItem.thisObject, queueItem.args);
    if ((0, _types.isPromise)(res)) {
      res.then(queueItem.resolve, queueItem.reject).finally(() => {
        this.running = false;
        this.run();
      });
    } else {
      queueItem.resolve(res);
      this.running = false;
      this.run();
    }
  }
}
exports.PromiseQueue = PromiseQueue;
//# sourceMappingURL=PromiseQueue.js.map