"use strict";

exports.getWithPopup = getWithPopup;
var _errors = require("../errors");
var _util = require("../util");
var _getToken = require("./getToken");
var _util2 = require("./util");
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
 *
 */

function getWithPopup(sdk, options) {
  if (arguments.length > 2) {
    return Promise.reject(new _errors.AuthSdkError('As of version 3.0, "getWithPopup" takes only a single set of options'));
  }

  // some browsers (safari, firefox) block popup if it's initialed from an async process
  // here we create the popup window immediately after user interaction
  // then redirect to the /authorize endpoint when the requestUrl is available
  const popupWindow = (0, _util2.loadPopup)('/', options);
  options = (0, _util.clone)(options) || {};
  Object.assign(options, {
    display: 'popup',
    responseMode: 'okta_post_message',
    popupWindow
  });
  return (0, _getToken.getToken)(sdk, options);
}
//# sourceMappingURL=getWithPopup.js.map