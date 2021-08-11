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

class OktaOidcMock: OktaOidcProtocol {
    let configuration: OktaOidcConfig
    
    private let shouldFail: Bool
    private let oidcManager: OktaOidcStateManager
    private let failedError: Error?
    
    private var callbackError: Error {
        failedError ?? OktaReactNativeError.oktaOidcError
    }
    
    init(configuration: OktaOidcConfig, shouldFail: Bool, failedError: Error? = nil) {
        self.configuration = configuration
        self.shouldFail = shouldFail
        self.failedError = failedError
        self.oidcManager = OktaOidcStateManager.makeOidcStateManager(with: configuration)
    }
    
    func signInWithBrowser(from presenter: UIViewController,
                           additionalParameters: [String: String],
                           callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        callback(shouldFail ? nil : oidcManager,
                 shouldFail ? callbackError : nil)
    }
    
    func signOutOfOkta(_ authStateManager: OktaOidcStateManager, from presenter: UIViewController, callback: @escaping ((Error?) -> Void)) {
        callback(shouldFail ? callbackError : nil)
    }
    
    func authenticate(withSessionToken sessionToken: String, callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        callback(shouldFail ? nil : oidcManager,
                 shouldFail ? callbackError : nil)
    }
}
