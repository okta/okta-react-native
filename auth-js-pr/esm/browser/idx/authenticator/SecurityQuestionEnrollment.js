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

class SecurityQuestionEnrollment extends Authenticator {
    canVerify(values) {
        const { credentials } = values;
        if (credentials && credentials.questionKey && credentials.answer) {
            return true;
        }
        const { questionKey, question, answer } = values;
        return !!(questionKey && answer) || !!(question && answer);
    }
    mapCredentials(values) {
        const { questionKey, question, answer } = values;
        if (!answer || (!questionKey && !question)) {
            return;
        }
        return {
            questionKey: question ? 'custom' : questionKey,
            question,
            answer
        };
    }
    getInputs() {
        return [
            { name: 'questionKey', type: 'string', required: true },
            { name: 'question', type: 'string', label: 'Create a security question' },
            { name: 'answer', type: 'string', label: 'Answer', required: true },
        ];
    }
}

export { SecurityQuestionEnrollment };
//# sourceMappingURL=SecurityQuestionEnrollment.js.map
