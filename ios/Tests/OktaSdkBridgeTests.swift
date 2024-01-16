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
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        XCTAssertTrue(OktaSdkBridge.requiresMainQueueSetup())
        XCTAssertEqual(bridge.methodQueue, .main)
    }
    
    func testSupportedEvent() {
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
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
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "createConfig must succeed.")
        
        
        bridge.createConfig(config.clientId,
                            redirectUrl: config.redirectUri.absoluteString,
                            endSessionRedirectUri: config.logoutRedirectUri?.absoluteString ?? "",
                            discoveryUri: config.issuer,
                            scopes: config.scopes,
                            userAgentTemplate: "",
                            requestTimeout: 20) { (result) in
            XCTAssertNotNil(result)
            expectation.fulfill()
        } errorCallback: { (_) in
            XCTAssert(false, "createConfig failed.")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    // MARK: Sign In
    
    func testSignInSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Sign In must succeed.")
        
        // when
        bridge.signIn([:]) { result in
            let resultDictionary = result as? [String: String]
            XCTAssertNotNil(resultDictionary)
            XCTAssertEqual(resultDictionary?[OktaSdkConstant.RESOLVE_TYPE_KEY], OktaSdkConstant.AUTHORIZED)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.ACCESS_TOKEN_KEY])
            
            expectation.fulfill()
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Authentication failed.")
        }
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        
        let resultDictionary = bridge.eventsRegister[OktaSdkConstant.SIGN_IN_SUCCESS] as! [String: String?]
        
        XCTAssertEqual(resultDictionary[OktaSdkConstant.RESOLVE_TYPE_KEY]!, OktaSdkConstant.AUTHORIZED)
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.ACCESS_TOKEN_KEY]!)
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testSignInFailed() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Sign In must fail.")
        
        // when
        bridge.signIn([:]) { result in
            XCTAssert(false, "Authentication succeeded.")
        } promiseRejecter: { (code, message, error) in
            // then
            XCTAssertNotNil(code)
            XCTAssertNotNil(message)
            XCTAssertNotNil(error)
            
            expectation.fulfill()
        }
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)

        let resultDictionary = bridge.eventsRegister[OktaSdkConstant.ON_ERROR] as! [String: String?]
        
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.ERROR_CODE_KEY]!)
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.ERROR_MSG_KEY]!)
    }
    
    func testSignInWithNoSSO() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Sign In must succeed.")
        
        // when
        bridge.signIn(["noSSO": "true"]) { result in
            let resultDictionary = result as? [String: String]
            XCTAssertNotNil(resultDictionary)
            XCTAssertEqual(resultDictionary?[OktaSdkConstant.RESOLVE_TYPE_KEY], OktaSdkConstant.AUTHORIZED)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.ACCESS_TOKEN_KEY])
            
            expectation.fulfill()
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Authentication failed.")
        }
        
        // then
        if #available(iOS 13.0, *) {
            XCTAssertTrue(oidc.configuration.noSSO)
        }
        
        XCTAssertNotNil(bridge.eventsRegister[OktaSdkConstant.SIGN_IN_SUCCESS])
    }
    
    // MARK: Authenticate
    
    func testAuthenticationWithTokenSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Authentication with Session Token must succeed.")
        
        // when
        bridge.authenticate("{SessionToken}") { token in
            // then
            XCTAssertEqual(bridge.eventsRegister.count, 1)
            
            let resultDictionary = bridge.eventsRegister[OktaSdkConstant.SIGN_IN_SUCCESS] as! [String: String?]
            XCTAssertEqual(resultDictionary[OktaSdkConstant.RESOLVE_TYPE_KEY]!, OktaSdkConstant.AUTHORIZED)
            XCTAssertNotNil(resultDictionary[OktaSdkConstant.ACCESS_TOKEN_KEY]!)
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Authentication failed.")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testAuthenticationWithTokenFailed() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
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
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        // before sign out we should store state manager.
        testSignInSucceeded()
        
        let expectation = XCTestExpectation(description: "Sign Out succeed.")
        
        // when
        bridge.signOut { result in
            let resultDictionary = result as? [String: String]
            XCTAssertNotNil(resultDictionary)
            XCTAssertEqual(resultDictionary?[OktaSdkConstant.RESOLVE_TYPE_KEY], OktaSdkConstant.SIGNED_OUT)
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "signOut failed")
        }

        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        
        let result = bridge.eventsRegister[OktaSdkConstant.SIGN_OUT_SUCCESS] as? [String: String]
        XCTAssertEqual(result?[OktaSdkConstant.RESOLVE_TYPE_KEY], OktaSdkConstant.SIGNED_OUT)
    }
    
    func testSignOutFailed() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Sign Out failed.")
        
        // before sign out we should store state manager.
        testSignInSucceeded()
        // when
        bridge.signOut { result in
            XCTAssert(false, "signOut succeed.")
            
        } promiseRejecter: { (code, message, error) in
            XCTAssertNotNil(code)
            XCTAssertNotNil(message)
            XCTAssertNotNil(error)
            
            expectation.fulfill()
        }
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)
        
        let resultDictionary = bridge.eventsRegister[OktaSdkConstant.ON_ERROR] as! [String: String?]
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.ERROR_CODE_KEY]!)
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.ERROR_MSG_KEY]!)
    }
    
    func testGetAccessTokenSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        testSignInSucceeded()
        
        let expectation = XCTestExpectation(description: "Getting Access Token must succeed.")
        
        // when
        bridge.getAccessToken { result in
            let resultDictionary = result as? [String: String]
            XCTAssertNotNil(resultDictionary)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.ACCESS_TOKEN_KEY])
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Getting Access Token failed.")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testGetIDTokenSucceeded() {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        testSignInSucceeded()
        
        let expectation = XCTestExpectation(description: "Getting ID Token must succeed.")
        
        // when
        bridge.getIdToken { result in
            let resultDictionary = result as? [String: String]
            XCTAssertNotNil(resultDictionary)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.ID_TOKEN_KEY])
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Getting ID Token failed.")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testGetUserSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Getting User must succeed.")
        
        // when
        bridge.getUser { (userData) in
            XCTAssertNotNil(userData as? [String: Any])
            
            expectation.fulfill()
        } promiseRejecter: { (code, message, error) in
            XCTAssert(false, "Getting User failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIsAuthenticatedSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        stateManager.accessToken = OktaOidcStateManager.mockAccessToken
        stateManager.idToken = OktaOidcStateManager.mockIdToken
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "isAuthenticated must return true.")
        
        bridge.isAuthenticated { (result) in
            let resultDictionary = result as? [String: Any]
            let isAuthenticated = resultDictionary?[OktaSdkConstant.AUTHENTICATED_KEY] as? Bool
            
            XCTAssertTrue(isAuthenticated ?? false)
            
            expectation.fulfill()
        } promiseRejecter: { _, _, _ in
            XCTAssert(false, "isAuthenticated failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRefreshTokensSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        stateManager.accessToken = OktaOidcStateManager.mockAccessToken
        stateManager.idToken = OktaOidcStateManager.mockIdToken
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Refresh Tokens must succeeded.")
        
        bridge.refreshTokens { (result) in
            let resultDictionary = result as? [String: String?]
            XCTAssertNotNil(resultDictionary)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.ACCESS_TOKEN_KEY]!)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.ID_TOKEN_KEY]!)
            XCTAssertNotNil(resultDictionary?[OktaSdkConstant.REFRESH_TOKEN_KEY]!)

            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Refresh Tokens failed")
        }
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testClearTokensSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Clear Tokens must succeeded.")
        
        // when
        bridge.clearTokens { (result) in
            let isClear = result as? Bool
            XCTAssertTrue(isClear ?? false)
            
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Refresh Tokens failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIntrospectIDTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Introspect ID Token must succeeded.")
        
        bridge.introspectIdToken { (result) in
            XCTAssertNotNil(result as? [String: Any])
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Introspect ID Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIntrospectAccessTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Introspect Access Token must succeeded.")
        
        bridge.introspectAccessToken { (result) in
            XCTAssertNotNil(result as? [String: Any])
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Introspect Access Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testIntrospectRefreshTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Introspect Refresh Token must succeeded.")
        
        bridge.introspectRefreshToken { (result) in
            XCTAssertNotNil(result as? [String: Any])
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Introspect Refresh Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRevokeIDTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Revoke ID Token must succeeded.")
        
        bridge.revokeIdToken { (result) in
            let isRevoked = result as? Bool
            XCTAssertTrue(isRevoked ?? false)
            
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Revoke ID Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRevokeAccessTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Revoke Access Token must succeeded.")
        
        bridge.revokeAccessToken { (result) in
            let isRevoked = result as? Bool
            XCTAssertTrue(isRevoked ?? false)
            
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Revoke Access Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testRevokeRefreshTokenSucceeded() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: false)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        let stateManager = OktaOidcStateManagerMock(shouldFail: false, config: try XCTUnwrap(bridge.config))
        bridge.setCustomStateManager(stateManager)
        
        let expectation = XCTestExpectation(description: "Revoke Refresh Token must succeeded.")
        
        bridge.revokeRefreshToken { (result) in
            let isRevoked = result as? Bool
            XCTAssertTrue(isRevoked ?? false)
            
            expectation.fulfill()
        } promiseRejecter: { (_, _, _) in
            XCTAssert(false, "Revoke Refresh Token failed")
        }

        wait(for: [expectation], timeout: 5)
    }
    
    func testCancellationErrorOnSignIn() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true, failedError: OktaOidcError.userCancelledAuthorizationFlow)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Cancellation must succeeded.")
        
        // when
        bridge.signIn([:]) { _ in
            XCTAssert(false, "Cancellation failed.")
        } promiseRejecter: { (errorCode, errorMessage, error) in
            XCTAssertEqual(errorCode, "-1200")
            XCTAssertNotNil(errorMessage)
            XCTAssertNotNil(error)
            
            expectation.fulfill()
        }
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)

        let resultDictionary = bridge.eventsRegister[OktaSdkConstant.ON_CANCELLED] as! [String: String?]
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.RESOLVE_TYPE_KEY]!)
        
        wait(for: [expectation], timeout: 5)
    }
    
    func testCancellationErrorOnSignOut() throws {
        // given
        let oidc = OktaOidcMock(configuration: config, shouldFail: true, failedError: OktaOidcError.userCancelledAuthorizationFlow)
        let bridge = OktaSdkBridgeMock()
        bridge.oktaOidc = oidc
        
        let expectation = XCTestExpectation(description: "Cancellation must succeeded.")
        
        // when
        bridge.signOut { _ in
            XCTAssert(false, "Cancellation failed.")
        } promiseRejecter: { (errorCode, errorMessage, error) in
            XCTAssertEqual(errorCode, "-1200")
            XCTAssertNotNil(errorMessage)
            XCTAssertNotNil(error)
            
            expectation.fulfill()
        }
        
        // then
        XCTAssertEqual(bridge.eventsRegister.count, 1)

        let resultDictionary = bridge.eventsRegister[OktaSdkConstant.ON_CANCELLED] as! [String: String?]
        XCTAssertNotNil(resultDictionary[OktaSdkConstant.RESOLVE_TYPE_KEY]!)
            
        wait(for: [expectation], timeout: 5)
    }
}
