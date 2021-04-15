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
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuZXhhbXBsZS5jb20iLCJpYXQiOjE2MTg0NzU1ODMsImV4cCI6MjEyMzM5NzE4MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.WY2K4adyY9p--NN83REjZzZglUI7JjxPNvmI3VigGFo
    """
    
    static let mockAccessToken = mockIdToken
    
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
    
    private var customStateManager: StateManagerProtocol?
    
    func setCustomStateManager(_ stateManager: StateManagerProtocol) {
        self.customStateManager = stateManager
    }
    
    // Must be overriden
    override func supportedEvents() -> [String]! {
        super.supportedEvents()
    }
    
    override func sendEvent(withName name: String!, body: Any!) {
        eventsRegister[name] = body
    }
    
    override func presentedViewController() -> UIViewController? {
        UIViewController()
    }
    
    override func readStateManager() -> StateManagerProtocol? {
        if customStateManager != nil {
            return customStateManager
        }
        
        return config.flatMap {
            OktaOidcMock.oidcStateManager(with: $0)
        }
    }
}

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
        callback(shouldFail ? nil : OktaOidcMock.oidcStateManager(with: config),
                 shouldFail ? OktaOidcError.noRefreshToken : nil)
    }
    
    func revoke(_ token: String?, callback: @escaping (Bool, Error?) -> Void) {
        callback(!shouldFail, shouldFail ? OktaOidcError.noBearerToken : nil)
    }
    
    func introspect(token: String?, callback: @escaping ([String: Any]?, Error?) -> Void) {
        callback(shouldFail ? nil : ["exp": "mock"],
                 shouldFail ? OktaOidcError.noBearerToken : nil)
    }
    
    func clear() {
        // nothing
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
    
    func testMainQueue() {
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        XCTAssertTrue(OktaSdkBridge.requiresMainQueueSetup())
        XCTAssertEqual(bridge.methodQueue, .main)
    }
    
    func testSupportedEvent() {
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        XCTAssertEqual(bridge.supportedEvents(), [
            OktaSdkConstant.SIGN_IN_SUCCESS,
            OktaSdkConstant.SIGN_OUT_SUCCESS,
            OktaSdkConstant.ON_ERROR,
            OktaSdkConstant.ON_CANCELLED
        ])
    }
    
    func testCreateConfigSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        let expectation = XCTestExpectation(description: "createConfig must succeed.")
        
        
        bridge.createConfig(config.clientId,
                            redirectUrl: config.redirectUri.absoluteString,
                            endSessionRedirectUri: config.logoutRedirectUri?.absoluteString ?? "",
                            discoveryUri: config.issuer,
                            scopes: config.scopes,
                            userAgentTemplate: "") { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "createConfig failed.")
        }

        wait(for: [expectation], timeout: 5)
    }
    
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
        // before sign out we should store state manager.
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
        
        // before sign out we should store state manager.
        testSignInSucceeded()
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
        
        testSignInSucceeded()
        
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
        
        testSignInSucceeded()
        
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
    
    func testGetUserSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Getting User must succeed.")
        
        // when
        bridge.getUser { (userData) in
            XCTAssertNotNil(userData)
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Getting User failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIsAuthenticatedSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        stateManager.accessToken = OktaOidcMock.mockAccessToken
        stateManager.idToken = OktaOidcMock.mockIdToken
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "isAuthenticated must return true.")
        
        bridge.isAuthenticated { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { _, _, _ in
            XCTAssert(false, "isAuthenticated failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRefreshTokensSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        stateManager.accessToken = OktaOidcMock.mockAccessToken
        stateManager.idToken = OktaOidcMock.mockIdToken
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Refresh Tokens must succeeded.")
        
        bridge.refreshTokens { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Refresh Tokens failed")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testClearTokensSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        
        let expectation = XCTestExpectation(description: "Clear Tokens must succeeded.")
        
        // when
        bridge.clearTokens { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Refresh Tokens failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIntrospectIDTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Introspect ID Token must succeeded.")
        
        bridge.introspectIdToken { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Introspect ID Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIntrospectAccessTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Introspect Access Token must succeeded.")
        
        bridge.introspectAccessToken { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Introspect Access Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIntrospectRefreshTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Introspect Refresh Token must succeeded.")
        
        bridge.introspectRefreshToken { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Introspect Refresh Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRevokeIDTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Revoke ID Token must succeeded.")
        
        bridge.revokeIdToken { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Revoke ID Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRevokeAccessTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Revoke Access Token must succeeded.")
        
        bridge.revokeAccessToken { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Revoke Access Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRevokeRefreshTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock(oidc: oidc)
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Revoke Refresh Token must succeeded.")
        
        bridge.revokeRefreshToken { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Revoke Refresh Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
}
