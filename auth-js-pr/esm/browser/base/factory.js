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

import { removeNils } from '../util/object.js';
import * as features from '../features.js';
import * as constants from '../constants.js';
import Emitter from 'tiny-emitter';

function createOktaAuthBase(OptionsConstructor) {
    class OktaAuthBase {
        constructor(...args) {
            const options = new OptionsConstructor(args.length ? args[0] || {} : {});
            this.options = removeNils(options);
            this.emitter = new Emitter();
            this.features = features;
        }
    }
    OktaAuthBase.features = features;
    OktaAuthBase.constants = constants;
    OktaAuthBase.features = OktaAuthBase.prototype.features = features;
    Object.assign(OktaAuthBase, {
        constants
    });
    return OktaAuthBase;
}

export { createOktaAuthBase };
//# sourceMappingURL=factory.js.map
