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
  
  static let testing: TimeInterval = 60
  static let testing: TimeInterval = 15
}

class LoginTests: XCTestCase {
  let username = "oleg.gnidets@okta.com"
  let password = "QWEqwe123!"

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
    
    try XCTSkipIf(username.isEmpty, "Username is empty")
    try XCTSkipIf(password.isEmpty, "Password is empty")
    
    app = XCUIApplication()
    app.launch()
  }
  
  func testRootScreen() throws {
    // then
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
    XCTAssertTrue(customLoginButton.exists)
  }
}
