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

function hasTokensInHash(hash) {
    return /((id|access)_token=)/i.test(hash);
}
function hasAuthorizationCode(hashOrSearch) {
    return /(code=)/i.test(hashOrSearch);
}
function hasInteractionCode(hashOrSearch) {
    return /(interaction_code=)/i.test(hashOrSearch);
}
function hasErrorInUrl(hashOrSearch) {
    return /(error=)/i.test(hashOrSearch) || /(error_description)/i.test(hashOrSearch);
}
function isRedirectUri(uri, sdk) {
    var authParams = sdk.options;
    if (!uri || !authParams.redirectUri) {
        return false;
    }
    return uri.indexOf(authParams.redirectUri) === 0;
}
function isCodeFlow(options) {
    return options.pkce || options.responseType === 'code' || options.responseMode === 'query';
}
function getHashOrSearch(options) {
    var codeFlow = isCodeFlow(options);
    var useQuery = codeFlow && options.responseMode !== 'fragment';
    return useQuery ? window.location.search : window.location.hash;
}
function isLoginRedirect(sdk) {
    if (!isRedirectUri(window.location.href, sdk)) {
        return false;
    }
    var codeFlow = isCodeFlow(sdk.options);
    var hashOrSearch = getHashOrSearch(sdk.options);
    if (hasErrorInUrl(hashOrSearch)) {
        return true;
    }
    if (codeFlow) {
        var hasCode = hasAuthorizationCode(hashOrSearch) || hasInteractionCode(hashOrSearch);
        return hasCode;
    }
    return hasTokensInHash(window.location.hash);
}
function isInteractionRequired(sdk, hashOrSearch) {
    if (!hashOrSearch) {
        if (!isLoginRedirect(sdk)) {
            return false;
        }
        hashOrSearch = getHashOrSearch(sdk.options);
    }
    return /(error=interaction_required)/i.test(hashOrSearch);
}

export { getHashOrSearch, hasAuthorizationCode, hasErrorInUrl, hasInteractionCode, hasTokensInHash, isCodeFlow, isInteractionRequired, isLoginRedirect, isRedirectUri };
//# sourceMappingURL=loginRedirect.js.map
