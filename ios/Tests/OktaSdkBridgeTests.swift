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
    let configuration: OktaOidcConfig
    
    private let shouldFail: Bool
    
    // expires in 2037
    static let mockIdToken = """
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9\
    .eyJzdWIiOiIwMHVlMWdpMHB0WnBhNjdwVTBoNyIsIm5hbWUiOiJKb3JkYW4gTWVsYmVyZyIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9kZW1vLW9yZy5va3RhcHJldmlldy5jb20vb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiIwb2FlMWVuaWE2b2Qybmx6MDBoNyIsImlhdCI6MTUyMTIzMDMzNiwiZXhwIjoxNjE4NDE4OTYwLCJqdGkiOiJJRC5Fc0g5MndqVU1fNTJOdHg1Mlc0QkFpNGVlRUlJak5WbFZYaVZxbkR5S2U4IiwiYW1yIjpbInB3ZCJdLCJpZHAiOiIwMG9lMWdpMG5mU3FBY0VaMjBoNyIsInByZWZlcnJlZF91c2VybmFtZSI6ImpvcmRhbi5tZWxiZXJnQG9rdGEuY29tIiwiYXV0aF90aW1lIjoxNTIxMjMwMzM1LCJhdF9oYXNoIjoiUmNRM2dHeXQ3bHJIckFwenF4RkxmQSJ9\
    .FVF_SLZ3-bOW8Uy-cFq40o-aqndBxLIdWQuA6L6ZMIQ
    """
    
    init(configuration: OktaOidcConfig, shouldFail: Bool) {
        self.configuration = configuration
        self.shouldFail = shouldFail
    }
    
    func signInWithBrowser(from presenter: UIViewController,
                           additionalParameters: [String: String],
                           callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        let oidcManager = Self.oidcStateManager(with: configuration)
        callback(shouldFail ? nil : oidcManager, shouldFail ? OktaReactNativeError.oktaOidcError : nil)
    }
    
    func signOutOfOkta(_ authStateManager: OktaOidcStateManager, from presenter: UIViewController, callback: @escaping ((Error?) -> Void)) {
        callback(shouldFail ? OktaReactNativeError.oktaOidcError : nil)
    }
    
    func authenticate(withSessionToken sessionToken: String, callback: @escaping ((OktaOidcStateManager?, Error?) -> Void)) {
        let oidcManager = Self.oidcStateManager(with: configuration)
        callback(shouldFail ? nil : oidcManager, shouldFail ? OktaReactNativeError.oktaOidcError : nil)
    }
    
    static func oidcStateManager(with configuration: OktaOidcConfig) -> OktaOidcStateManager {
        let serviceConfig = OKTServiceConfiguration(authorizationEndpoint: URL(string: configuration.issuer)!,
                                                    tokenEndpoint: URL(string: configuration.issuer)!,
                                                    issuer: URL(string: configuration.issuer)!)
        
        let mockTokenRequest = OKTTokenRequest(configuration: serviceConfig,
                                               grantType: OKTGrantTypeRefreshToken,
                                               authorizationCode: nil,
                                               redirectURL: configuration.redirectUri,
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
                "expires_in": Date().addingTimeInterval(3600).timeIntervalSince1970 as NSCopying & NSObjectProtocol,
                "token_type": "Bearer" as NSCopying & NSObjectProtocol,
                "id_token": mockIdToken as NSCopying & NSObjectProtocol,
                "refresh_token": "refreshToken" as NSCopying & NSObjectProtocol,
                "scope": "openid offline_access" as NSCopying & NSObjectProtocol
            ]
        )
        
        let mockAuthRequest = OKTAuthorizationRequest(
            configuration: serviceConfig,
            clientId: configuration.clientId,
            clientSecret: nil,
            scopes: ["openid", "email"],
            redirectURL: configuration.redirectUri,
            responseType: OKTResponseTypeCode,
            additionalParameters: nil
        )
        
        let mockAuthResponse = OKTAuthorizationResponse(
            request: mockAuthRequest,
            parameters: ["code": "mockAuthCode" as NSCopying & NSObjectProtocol]
        )
        
        let authState = OKTAuthState(authorizationResponse: mockAuthResponse, tokenResponse: mockTokenResponse)
        return OktaOidcStateManager(authState: authState)
    }
}

final class OktaSdkBridgeMock: OktaSdkBridge {
    
    private(set) var eventsRegister: [String: Any] = [:]
    
    override func sendEvent(withName name: String!, body: Any!) {
        eventsRegister[name] = body
    }
    
    override func supportedEvents() -> [String]! {
        super.supportedEvents()
    }
    
    override func presentedViewController() -> UIViewController? {
        UIViewController()
    }
    
    override func readStateManager() -> OktaOidcStateManager? {
        config.flatMap {
            OktaOidcMock.oidcStateManager(with: $0)
        }
    }
}

final class OktaSdkBridgeTests: XCTestCase {
    
    private let config = try! OktaOidcConfig(with: [
        "issuer": "https://yourOktaDomain.com/oauth2/default",
        "clientId": "{clientID}",
        "redirectUri": "com.example://callback",
        "logoutRedirectUri": "com.example://logout",
        "scopes": "openid profile offline_access",
    ])
    
    func testSignInSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        // when
        bridge.signIn([:])
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        XCTAssertNotNil(bridge.eventsRegister[OktaSdkConstant.SIGN_IN_SUCCESS])
    }
    
    func testSignInFailed() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        // when
        bridge.signIn([:])
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        XCTAssertNotNil(bridge.eventsRegister[OktaSdkConstant.ON_ERROR])
    }
    
    func testAuthenticationWithTokenSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        let expectation = XCTestExpectation(description: "Authentication with Session Token must succeed.")

        // when
        bridge.authenticate("{SessionToken}") { token in
            XCTAssertEqual(bridge.eventsRegister.count, 1)
            XCTAssertNotNil(bridge.eventsRegister[OktaSdkConstant.SIGN_IN_SUCCESS])
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            // then
            XCTAssert(false, "Authentication failed.")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testAuthenticationWithTokenFailed() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        let expectation = XCTestExpectation(description: "Authentication with Session Token must fail.")

        // when
        bridge.authenticate("{SessionToken}") { token in
            XCTAssert(false, "Authentication succeeded.")
        } promiseRejecter: { (code, message, error) in
            // then
            XCTAssertNotNil(code)
            XCTAssertNotNil(message)
            XCTAssertNotNil(error)
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testSignOutSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        testSignInSucceeded()
        
        // when
        bridge.signOut()
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        XCTAssertNotNil(bridge.eventsRegister[OktaSdkConstant.SIGN_OUT_SUCCESS])
    }
    
    func testSignOutFailed() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        // when
        bridge.signOut()
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        XCTAssertNotNil(bridge.eventsRegister[OktaSdkConstant.ON_ERROR])
    }
    
    func testGetAccessTokenSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        let expectation = XCTestExpectation(description: "Getting Access Token must succeed.")
        
        // when
        bridge.getAccessToken { token in
            XCTAssertNotNil(token)
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Getting Access Token failed.")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testGetIDTokenSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        let expectation = XCTestExpectation(description: "Getting ID Token must succeed.")
        
        // when
        bridge.getIdToken { token in
            XCTAssertNotNil(token)
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Getting ID Token failed.")
        }
        
        wait(for: [expectation], timeout: 5)
    }
}
