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

extension TimeInterval {
  
  static let testing: TimeInterval = 50
}

class LoginTests: XCTestCase {
  var username = "george@acme.com"
  var password = "Abcd1234"

  private static var stopAfterFirstFail = false
  private(set) var app: XCUIApplication!
  
  var logoutButton: XCUIElement {
    app.buttons["logout_button"]
  }
  
  var browserLoginButton: XCUIElement {
    app.buttons["browser_login_button"]
  }
  
  var customLoginButton: XCUIElement {
    app.buttons["custom_login_button"]
  }
  
  var welcomeLabel: XCUIElement {
    app.staticTexts["welcome_text"]
  }
  
  override func setUpWithError() throws {
    try super.setUpWithError()
    
    continueAfterFailure = false
    
//    if Self.stopAfterFirstFail {
//      XCTFail("Failed test")
//    }
    
    app = XCUIApplication()
    app.launch()
  }
  
  override func tearDownWithError() throws {
    try super.tearDownWithError()

    if testRun?.totalFailureCount != .zero {
      Self.stopAfterFirstFail = true
    }
  }
  
  func testRootScreen() throws {
    // then
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
    XCTAssertTrue(customLoginButton.exists)
  }
}
