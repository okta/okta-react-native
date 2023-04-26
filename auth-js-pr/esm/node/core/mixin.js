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

import { parseOAuthResponseFromUrl } from '../oidc/parseFromUrl.js';
import { AuthStateManager } from './AuthStateManager.js';
import { ServiceManager } from './ServiceManager/node.js';

function mixinCore(Base) {
    return class OktaAuthCore extends Base {
        constructor(...args) {
            super(...args);
            this.authStateManager = new AuthStateManager(this);
            this.serviceManager = new ServiceManager(this, this.options.services);
        }
        async start() {
            await this.serviceManager.start();
            this.tokenManager.start();
            if (!this.token.isLoginRedirect()) {
                await this.authStateManager.updateAuthState();
            }
        }
        async stop() {
            this.tokenManager.stop();
            await this.serviceManager.stop();
        }
        async handleRedirect(originalUri) {
            await this.handleLoginRedirect(undefined, originalUri);
        }
        async handleLoginRedirect(tokens, originalUri) {
            let state = this.options.state;
            if (tokens) {
                this.tokenManager.setTokens(tokens);
                originalUri = originalUri || this.getOriginalUri(this.options.state);
            }
            else if (this.isLoginRedirect()) {
                try {
                    const oAuthResponse = await parseOAuthResponseFromUrl(this, {});
                    state = oAuthResponse.state;
                    originalUri = originalUri || this.getOriginalUri(state);
                    await this.storeTokensFromRedirect();
                }
                catch (e) {
                    await this.authStateManager.updateAuthState();
                    throw e;
                }
            }
            else {
                return;
            }
            await this.authStateManager.updateAuthState();
            this.removeOriginalUri(state);
            const { restoreOriginalUri } = this.options;
            if (restoreOriginalUri) {
                await restoreOriginalUri(this, originalUri);
            }
            else if (originalUri) {
                window.location.replace(originalUri);
            }
        }
    };
}

export { mixinCore };
//# sourceMappingURL=mixin.js.map
