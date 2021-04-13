/*
 * Copyright (c) 2019-Present, Okta, Inc. and/or its affiliates. All rights reserved.
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
    
    private let config: OktaOidcConfig
    private let shouldFail: Bool
    
    init(config: OktaOidcConfig, shouldFail: Bool) {
        self.config = config
        self.shouldFail = shouldFail
    }
    
    func signInWithBrowser(from presenter: UIViewController,
                           additionalParameters: [String: String],
                           callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        let serviceConfig = OKTServiceConfiguration(authorizationEndpoint: URL(string: config.issuer)!,
                                                    tokenEndpoint: URL(string: config.issuer)!,
                                                    issuer: URL(string: config.issuer)!)
        
        let mockTokenRequest = OKTTokenRequest(configuration: serviceConfig,
                                               grantType: OKTGrantTypeRefreshToken,
                                               authorizationCode: nil,
                                               redirectURL: config.redirectUri,
                                               clientID: "nil",
                                               clientSecret: nil,
                                               scope: nil,
                                               refreshToken: nil,
                                               codeVerifier: nil,
                                               additionalParameters: nil)
        
        let mockTokenResponse = OKTTokenResponse(
            request: mockTokenRequest,
            parameters: [
                "access_token": "mockAccessToken" as NSCopying & NSObjectProtocol,
                "expires_in": "expiresIn" as NSCopying & NSObjectProtocol,
                "token_type": "Bearer" as NSCopying & NSObjectProtocol,
                "id_token": "mockIdToken" as NSCopying & NSObjectProtocol,
                "refresh_token": "refreshToken" as NSCopying & NSObjectProtocol,
                "scope": "mockScopes" as NSCopying & NSObjectProtocol
            ]
        )
        
        let mockAuthRequest = OKTAuthorizationRequest(
            configuration: serviceConfig,
            clientId: config.clientId,
            clientSecret: nil,
            scopes: ["openid", "email"],
            redirectURL: config.redirectUri,
            responseType: OKTResponseTypeCode,
            additionalParameters: nil
        )
        
        let mockAuthResponse = OKTAuthorizationResponse(
            request: mockAuthRequest,
            parameters: ["code": "mockAuthCode" as NSCopying & NSObjectProtocol]
        )
        
        let authState = OKTAuthState(authorizationResponse: mockAuthResponse, tokenResponse: mockTokenResponse)
        let manager = OktaOidcStateManager(authState: authState)
        
        callback(shouldFail ? nil : manager, shouldFail ? OktaReactNativeError.notConfigured : nil)
    }
    
    func signOutOfOkta(_ authStateManager: OktaOidcStateManager, from presenter: UIViewController, callback: @escaping ((Error?) -> Void)) {
        
    }
    
    func authenticate(withSessionToken sessionToken: String, callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        
    }
}

final class OktaSdkBridgeTests: XCTestCase {
    
    
}
