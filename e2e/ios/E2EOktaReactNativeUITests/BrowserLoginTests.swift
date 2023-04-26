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

final class BrowserLoginTests: LoginTests {
  private let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
  
  private var springboardCancelButton: XCUIElement {
    springboard.buttons["Cancel"]
  }
  
  private var springboardContinueButton: XCUIElement {
    springboard.buttons["Continue"]
  }
  
  private var signInButton: XCUIElement {
    app.buttons["Sign In"]
  }
  
  func testLoginFlow() throws {
    // given
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
    // when
    browserLoginButton.tap()
    // then
    XCTAssertTrue(springboardContinueButton.waitForExistence(timeout: .testing))
    springboardContinueButton.tap()
    
    let webView = app.webViews
    
    let usernameField = webView.textFields.element(boundBy: .zero)
    XCTAssertTrue(usernameField.waitForExistence(timeout: .testing))
    usernameField.tap()
    usernameField.typeText(username)
    
    let doneButton = app.toolbars.buttons["Done"]
    if doneButton.exists && doneButton.isHittable {
      doneButton.tap()
    }
    
    let passwordField = webView.secureTextFields.allElementsBoundByIndex.first(where: { $0.frame.width >= usernameField.frame.width })!
    passwordField.tap()

    // `typeText` works weird. Sometimes it doesn't type correct text.
    UIPasteboard.general.string = password
    passwordField.doubleTap()
    app.menuItems["Paste"].tap()
  
    signInButton.tap()
    
    XCTAssertTrue(welcomeLabel.waitForExistence(timeout: .testing))
    XCTAssertTrue(userNameLabel.waitForExistence(timeout: .testing))
    
    app.terminate()
    app.launch()
    
    XCTAssertTrue(welcomeLabel.waitForExistence(timeout: .testing))
    XCTAssertTrue(userNameLabel.waitForExistence(timeout: .testing))
    
    logoutIfPossible(throwError: true)
  }
  
  func testCancelLoginFlow() throws {
    // given
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
    // when
    browserLoginButton.tap()
    // then
    XCTAssertTrue(springboardCancelButton.waitForExistence(timeout: .testing))
    springboardCancelButton.tap()
    
    XCTAssertTrue(browserLoginButton.exists)
    XCTAssertTrue(customLoginButton.exists)
  }
  
  func testIncorrectLoginFlow() throws {
    // given
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
    // when
    browserLoginButton.tap()
    // then
    XCTAssertTrue(springboardContinueButton.waitForExistence(timeout: .testing))
    springboardContinueButton.tap()
    
    let webView = app.webViews
    
    let usernameField = webView.textFields.element(boundBy: .zero)
    XCTAssertTrue(usernameField.waitForExistence(timeout: .testing))
    usernameField.tap()
    usernameField.typeText(username)
    
    let doneButton = app.toolbars.buttons["Done"]
    if doneButton.exists && doneButton.isHittable {
      doneButton.tap()
    }
    
    let passwordField = webView.secureTextFields.allElementsBoundByIndex.first { $0.frame.width >= usernameField.frame.width }!
    passwordField.tap()

    UIPasteboard.general.string = "1234567"
    passwordField.doubleTap()
    app.menuItems["Paste"].tap()
    
    signInButton.tap()
    
    app.buttons["Cancel"].tap()
    
    try testRootScreen()
  }
  
  private func logoutIfPossible(throwError: Bool = false) {
    guard logoutButton.waitForExistence(timeout: 10) else {
      XCTAssertFalse(throwError)
      return
    }
    
    logoutButton.tap()
    
    XCTAssertTrue(springboardContinueButton.waitForExistence(timeout: .testing))
    springboardContinueButton.tap()
    
    XCTAssertTrue(browserLoginButton.waitForExistence(timeout: .testing))
  }
}
