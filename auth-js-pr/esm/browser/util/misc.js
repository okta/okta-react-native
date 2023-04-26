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

function isoToUTCString(str) {
    var parts = str.match(/\d+/g), isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]), isoDate = new Date(isoTime);
    return isoDate.toUTCString();
}
function genRandomString(length) {
    var randomCharset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var random = '';
    for (var c = 0, cl = randomCharset.length; c < length; ++c) {
        random += randomCharset[Math.floor(Math.random() * cl)];
    }
    return random;
}
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function split2(str, delim) {
    const parts = str.split(delim);
    return [
        parts[0],
        parts.splice(1, parts.length).join(delim),
    ];
}

export { delay, genRandomString, isoToUTCString, split2 };
//# sourceMappingURL=misc.js.map
