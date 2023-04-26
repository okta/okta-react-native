"use strict";

exports.default = void 0;
var _crypto = require("../../crypto");
var _constants = require("../../constants");
/*!
 * Copyright (c) 2019-present, Okta, Inc. and/or its affiliates. All rights reserved.
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

/* eslint-disable complexity, max-statements */

function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}
function getRandomString(length) {
  var a = new Uint8Array(Math.ceil(length / 2));
  _crypto.webcrypto.getRandomValues(a);
  var str = Array.from(a, dec2hex).join('');
  return str.slice(0, length);
}
function generateVerifier(prefix) {
  var verifier = prefix || '';
  if (verifier.length < _constants.MIN_VERIFIER_LENGTH) {
    verifier = verifier + getRandomString(_constants.MIN_VERIFIER_LENGTH - verifier.length);
  }
  return encodeURIComponent(verifier).slice(0, _constants.MAX_VERIFIER_LENGTH);
}
function computeChallenge(str) {
  var buffer = new TextEncoder().encode(str);
  return _crypto.webcrypto.subtle.digest('SHA-256', buffer).then(function (arrayBuffer) {
    var hash = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
    var b64u = (0, _crypto.stringToBase64Url)(hash); // url-safe base64 variant
    return b64u;
  });
}
var _default = {
  DEFAULT_CODE_CHALLENGE_METHOD: _constants.DEFAULT_CODE_CHALLENGE_METHOD,
  generateVerifier,
  computeChallenge
};
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=pkce.js.map