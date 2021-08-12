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
@testable import ReactNativeOktaSdkBridge

final class OktaReactNativeErrorTests: XCTestCase {
    func testLocalizedDescription() {
        XCTAssertEqual(OktaReactNativeError.notConfigured.localizedDescription, "OktaOidc client isn't configured, check if you have created a configuration with createConfig")
        XCTAssertEqual(OktaReactNativeError.noView.localizedDescription, "No current view exists")
        XCTAssertEqual(OktaReactNativeError.unauthenticated.localizedDescription, "User is not authenticated, cannot perform the specific action")
        XCTAssertEqual(OktaReactNativeError.noStateManager.localizedDescription, "State Manager does not exist.")
        XCTAssertEqual(OktaReactNativeError.noIdToken.localizedDescription, "Id token does not exist")
        XCTAssertEqual(OktaReactNativeError.oktaOidcError.localizedDescription, "Okta Oidc error")
        XCTAssertEqual(OktaReactNativeError.errorTokenType.localizedDescription, "Token type not found")
        XCTAssertEqual(OktaReactNativeError.errorPayload.localizedDescription, "Error in retrieving payload")
        XCTAssertEqual(OktaReactNativeError.noAccessToken.localizedDescription, "No access token found")
        XCTAssertEqual(OktaReactNativeError.cancelled.localizedDescription, "User cancelled a session")
    }
    
    func testErrorCode() {
        XCTAssertEqual(OktaReactNativeError.notConfigured.errorCode, "-100")
        XCTAssertEqual(OktaReactNativeError.noView.errorCode, "-200")
        XCTAssertEqual(OktaReactNativeError.unauthenticated.errorCode, "-300")
        XCTAssertEqual(OktaReactNativeError.noStateManager.errorCode, "-400")
        XCTAssertEqual(OktaReactNativeError.noIdToken.errorCode, "-500")
        XCTAssertEqual(OktaReactNativeError.oktaOidcError.errorCode, "-600")
        XCTAssertEqual(OktaReactNativeError.errorTokenType.errorCode, "-700")
        XCTAssertEqual(OktaReactNativeError.errorPayload.errorCode, "-800")
        XCTAssertEqual(OktaReactNativeError.noAccessToken.errorCode, "-900")
        XCTAssertEqual(OktaReactNativeError.cancelled.errorCode, "-1200")
    }

}
