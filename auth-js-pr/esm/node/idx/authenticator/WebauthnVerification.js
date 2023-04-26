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

import { Authenticator } from './Authenticator.js';

class WebauthnVerification extends Authenticator {
    canVerify(values) {
        const { credentials } = values;
        const obj = credentials || values;
        const { clientData, authenticatorData, signatureData } = obj;
        return !!(clientData && authenticatorData && signatureData);
    }
    mapCredentials(values) {
        const { credentials, authenticatorData, clientData, signatureData } = values;
        if (!credentials && !authenticatorData && !clientData && !signatureData) {
            return;
        }
        return credentials || ({
            authenticatorData,
            clientData,
            signatureData
        });
    }
    getInputs() {
        return [
            { name: 'authenticatorData', type: 'string', label: 'Authenticator Data', required: true, visible: false },
            { name: 'clientData', type: 'string', label: 'Client Data', required: true, visible: false },
            { name: 'signatureData', type: 'string', label: 'Signature Data', required: true, visible: false },
        ];
    }
}

export { WebauthnVerification };
//# sourceMappingURL=WebauthnVerification.js.map
