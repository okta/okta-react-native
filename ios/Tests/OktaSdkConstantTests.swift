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

final class OktaSdkConstantTests: XCTestCase {
    func testKeys() {
        XCTAssertEqual(OktaSdkConstant.RESOLVE_TYPE_KEY, "resolve_type")
        XCTAssertEqual(OktaSdkConstant.ACCESS_TOKEN_KEY, "access_token")
        XCTAssertEqual(OktaSdkConstant.ID_TOKEN_KEY, "id_token")
        XCTAssertEqual(OktaSdkConstant.REFRESH_TOKEN_KEY, "refresh_token")
        XCTAssertEqual(OktaSdkConstant.AUTHENTICATED_KEY, "authenticated")
        XCTAssertEqual(OktaSdkConstant.ERROR_CODE_KEY, "error_code")
        XCTAssertEqual(OktaSdkConstant.ERROR_MSG_KEY, "error_message")
    }
    
    func testValues() {
        XCTAssertEqual(OktaSdkConstant.AUTHORIZED, "authorized")
        XCTAssertEqual(OktaSdkConstant.SIGNED_OUT, "signed_out")
        XCTAssertEqual(OktaSdkConstant.CANCELLED, "cancelled")
    }
    
    func testEvents() {
        XCTAssertEqual(OktaSdkConstant.SIGN_IN_SUCCESS, "signInSuccess")
        XCTAssertEqual(OktaSdkConstant.ON_ERROR, "onError")
        XCTAssertEqual(OktaSdkConstant.SIGN_OUT_SUCCESS, "signOutSuccess")
        XCTAssertEqual(OktaSdkConstant.ON_CANCELLED, "onCancelled")
    }
}
