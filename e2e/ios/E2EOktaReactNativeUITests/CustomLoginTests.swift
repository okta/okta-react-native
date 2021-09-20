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

final class CustomLoginTests: LoginTests {
  
  private var signInButton: XCUIElement {
    app.buttons["sign_in_button"]
  }
  
  private var usernameTextField: XCUIElement {
    app.textFields["username_input"]
  }
  
  private var passwordTextField: XCUIElement {
    app.secureTextFields["password_input"]
  }
  
  override func setUpWithError() throws {
    try super.setUpWithError()
  }
  
  func testLoginFlow() throws {
    // given
    XCTAssertTrue(customLoginButton.waitForExistence(timeout: .testing))
    // when
    customLoginButton.tap()
    
    // then
    XCTAssertTrue(usernameTextField.waitForExistence(timeout: .testing))
    XCTAssertTrue(passwordTextField.exists)
    XCTAssertTrue(signInButton.exists)
    
    usernameTextField.tap()
    usernameTextField.typeText(username)
    
    passwordTextField.tap()
    passwordTextField.typeText(password)
  
    signInButton.tap()
    
    XCTAssertTrue(welcomeLabel.waitForExistence(timeout: .testing))
    
    app.terminate()
    app.launch()
    
    XCTAssertTrue(welcomeLabel.waitForExistence(timeout: .testing))
    
    XCTAssertTrue(logoutButton.exists)
    logoutButton.tap()
    
    try testRootScreen()
  }
  
  func testIncorrectLoginFlow() throws {
    // given
    XCTAssertTrue(customLoginButton.waitForExistence(timeout: .testing))
    // when
    customLoginButton.tap()
    // then
    XCTAssertTrue(usernameTextField.waitForExistence(timeout: .testing))
    XCTAssertTrue(passwordTextField.exists)
    
    usernameTextField.tap()
    usernameTextField.typeText(username)
    
    passwordTextField.tap()
    passwordTextField.typeText("1123123")
  
    signInButton.tap()
    
    let alertOKButton = app.alerts.element.buttons["OK"]
    
    XCTAssert(alertOKButton.waitForExistence(timeout: .testing))
    alertOKButton.tap()
    
    XCTAssertTrue(usernameTextField.exists)
    XCTAssertTrue(passwordTextField.exists)
    XCTAssertTrue(signInButton.exists)
  }
  
  private func logoutIfPossible(throwError: Bool = false) {
    guard logoutButton.waitForExistence(timeout: 10) else {
      XCTAssertFalse(throwError)
      return
    }
    
    logoutButton.tap()
    
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
  }
}
