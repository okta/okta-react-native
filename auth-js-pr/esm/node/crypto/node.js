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

import atobModule from 'atob';
import btoaModule from 'btoa';
import { Crypto } from '@peculiar/webcrypto';

let a;
if (typeof atob !== 'undefined') {
    a = atob;
}
else {
    a = atobModule;
}
let b;
if (typeof btoa !== 'undefined') {
    b = btoa;
}
else {
    b = btoaModule;
}
const crypto = (async () => {
    try {
        return await import('crypto');
    }
    catch (err) {
        return undefined;
    }
})();
let webcrypto;
if (typeof crypto !== 'undefined' && crypto['webcrypto']) {
    webcrypto = crypto['webcrypto'];
}
else {
    webcrypto = new Crypto();
}

export { a as atob, b as btoa, webcrypto };
//# sourceMappingURL=node.js.map
