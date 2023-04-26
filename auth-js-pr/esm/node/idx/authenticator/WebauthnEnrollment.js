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

class WebauthnEnrollment extends Authenticator {
    canVerify(values) {
        const { credentials } = values;
        const obj = credentials || values;
        const { clientData, attestation } = obj;
        return !!(clientData && attestation);
    }
    mapCredentials(values) {
        const { credentials, clientData, attestation } = values;
        if (!credentials && !clientData && !attestation) {
            return;
        }
        return credentials || ({
            clientData,
            attestation
        });
    }
    getInputs() {
        return [
            { name: 'clientData', type: 'string', required: true, visible: false, label: 'Client Data' },
            { name: 'attestation', type: 'string', required: true, visible: false, label: 'Attestation' },
        ];
    }
}

export { WebauthnEnrollment };
//# sourceMappingURL=WebauthnEnrollment.js.map
