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

import '../../crypto/node.js';
import 'tiny-emitter';
import { createBaseOptionsConstructor } from '../../base/options.js';
import { getCookieSettings, getStorage, STORAGE_MANAGER_OPTIONS } from './node.js';

function createStorageOptionsConstructor() {
    const BaseOptionsConstructor = createBaseOptionsConstructor();
    return class StorageOptionsConstructor extends BaseOptionsConstructor {
        constructor(args) {
            super(args);
            this.cookies = getCookieSettings(args);
            this.storageUtil = args.storageUtil || getStorage();
            this.storageManager = Object.assign(Object.assign({}, STORAGE_MANAGER_OPTIONS), args.storageManager);
        }
    };
}

export { createStorageOptionsConstructor };
//# sourceMappingURL=StorageOptionsConstructor.js.map
