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

import { warn } from '../../util/console.js';
import storageUtil from '../../browser/browserStorage.js';

function getStorage() {
    const storageUtil$1 = Object.assign({}, storageUtil, {
        inMemoryStore: {}
    });
    return storageUtil$1;
}
const STORAGE_MANAGER_OPTIONS = {
    token: {
        storageTypes: [
            'localStorage',
            'sessionStorage',
            'cookie'
        ]
    },
    cache: {
        storageTypes: [
            'localStorage',
            'sessionStorage',
            'cookie'
        ]
    },
    transaction: {
        storageTypes: [
            'sessionStorage',
            'localStorage',
            'cookie'
        ]
    },
    'shared-transaction': {
        storageTypes: [
            'localStorage'
        ]
    },
    'original-uri': {
        storageTypes: [
            'localStorage'
        ]
    }
};
function getCookieSettings(args = {}, isHTTPS) {
    var cookieSettings = args.cookies || {};
    if (typeof cookieSettings.secure === 'undefined') {
        cookieSettings.secure = isHTTPS;
    }
    if (typeof cookieSettings.sameSite === 'undefined') {
        cookieSettings.sameSite = cookieSettings.secure ? 'none' : 'lax';
    }
    if (cookieSettings.secure && !isHTTPS) {
        warn('The current page is not being served with the HTTPS protocol.\n' +
            'For security reasons, we strongly recommend using HTTPS.\n' +
            'If you cannot use HTTPS, set "cookies.secure" option to false.');
        cookieSettings.secure = false;
    }
    if (cookieSettings.sameSite === 'none' && !cookieSettings.secure) {
        cookieSettings.sameSite = 'lax';
    }
    return cookieSettings;
}

export { STORAGE_MANAGER_OPTIONS, getCookieSettings, getStorage };
//# sourceMappingURL=browser.js.map
