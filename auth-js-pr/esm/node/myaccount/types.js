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

import '../crypto/node.js';
import 'tiny-emitter';
import '../server/serverStorage.js';
import 'cross-fetch';

var EmailRole;
(function (EmailRole) {
    EmailRole["PRIMARY"] = "PRIMARY";
    EmailRole["SECONDARY"] = "SECONDARY";
})(EmailRole || (EmailRole = {}));
var Status;
(function (Status) {
    Status["VERIFIED"] = "VERIFIED";
    Status["UNVERIFIED"] = "UNVERIFIED";
})(Status || (Status = {}));
var PasswordStatus;
(function (PasswordStatus) {
    PasswordStatus["NOT_ENROLLED"] = "NOT_ENROLLED";
    PasswordStatus["ACTIVE"] = "ACTIVE";
})(PasswordStatus || (PasswordStatus = {}));

export { EmailRole, PasswordStatus, Status };
//# sourceMappingURL=types.js.map
