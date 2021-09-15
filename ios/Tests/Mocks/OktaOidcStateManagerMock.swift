/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import XCTest
import OktaOidc
@testable import ReactNativeOktaSdkBridge

final class OktaOidcStateManagerMock: StateManagerProtocol {
    var accessToken: String?
    var idToken: String?
    var refreshToken: String?
    
    private let shouldFail: Bool
    private let config: OktaOidcConfig
    
    init(shouldFail: Bool, config: OktaOidcConfig) {
        self.shouldFail = shouldFail
        self.config = config
    }
    
    func getUser(_ callback: @escaping ([String: Any]?, Error?) -> Void) {
        callback(shouldFail ? nil : ["name": "mock"],
                 shouldFail ? OktaOidcError.noUserInfoEndpoint : nil)
    }
    
    func renew(callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        callback(shouldFail ? nil : OktaOidcStateManager.makeOidcStateManager(with: config),
                 shouldFail ? OktaOidcError.noRefreshToken : nil)
    }
    
    func revoke(_ token: String?, callback: @escaping (Bool, Error?) -> Void) {
        callback(!shouldFail, shouldFail ? OktaOidcError.noBearerToken : nil)
    }
    
    func introspect(token: String?, callback: @escaping ([String: Any]?, Error?) -> Void) {
        callback(shouldFail ? nil : ["exp": "mock"],
                 shouldFail ? OktaOidcError.noBearerToken : nil)
    }
    
    func removeFromSecureStorage() throws {
        
    }
}
