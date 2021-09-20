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

final class BrowserSignInUITests: XCTestCase {
  private var username = ProcessInfo.processInfo.environment["USERNAME"]!
  private var password = ProcessInfo.processInfo.environment["PASSWORD"]!
  
  private var app: XCUIApplication!
  private let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
  
  private var loginButton: XCUIElement {
    app.buttons["loginButton"]
  }
  
  private var logoutButton: XCUIElement {
    app.buttons["logoutButton"]
  }
  
  private var springboardContinueButton: XCUIElement {
    springboard.buttons["Continue"]
  }
  
  private var signInButton: XCUIElement {
    app.buttons["Sign In"]
  }
  
  override func setUpWithError() throws {
    continueAfterFailure = false
    
    app = XCUIApplication()
    app.launch()
    
    logoutIfPossible()
  }
  
  override func tearDownWithError() throws {
  
  }
  
  func testRootScreen() throws {
    // then
    XCTAssertTrue(app.staticTexts["titleLabel"].waitForExistence(timeout: .testing))
    XCTAssertTrue(loginButton.waitForExistence(timeout: .testing))
  }
  
  func testCancelLoginFlow() throws {
    // given
    XCTAssertTrue(loginButton.waitForExistence(timeout: .testing))
    // when
    loginButton.tap()
    // then
    XCTAssertTrue(springboard.buttons["Cancel"].waitForExistence(timeout: .testing))
  }
  
  func testLoginFlow() throws {
    // given
    XCTAssertTrue(loginButton.waitForExistence(timeout: .testing))
    // when
    loginButton.tap()
    // then
    XCTAssertTrue(springboardContinueButton.waitForExistence(timeout: .testing))
    springboardContinueButton.tap()
    
    let webView = app.webViews
    
    let usernameField = webView.textFields.element(boundBy: .zero)
    XCTAssertTrue(usernameField.waitForExistence(timeout: .testing))
    usernameField.tap()
    usernameField.typeText(username)
    
    let doneButton = app.toolbars.buttons["Done"]
    if doneButton.exists {
      doneButton.tap()
    }
    
    let passwordField = webView.secureTextFields.allElementsBoundByIndex.first(where: { $0.frame.width >= usernameField.frame.width })!
    passwordField.tap()

    // `typeText` works weird. Sometimes it doesn't type correct text.
    UIPasteboard.general.string = password
    passwordField.doubleTap()
    app.menuItems["Paste"].tap()
  
    signInButton.tap()
    
    XCTAssertTrue(logoutButton.waitForExistence(timeout: .testing))
  }
  
  func testIncorrectLoginFlow() throws {
    // given
    XCTAssertTrue(loginButton.waitForExistence(timeout: .testing))
    // when
    loginButton.tap()
    // then
    XCTAssertTrue(springboardContinueButton.waitForExistence(timeout: .testing))
    springboardContinueButton.tap()
    
    let webView = app.webViews
    
    let usernameField = webView.textFields.element(boundBy: .zero)
    XCTAssertTrue(usernameField.waitForExistence(timeout: .testing))
    usernameField.tap()
    usernameField.typeText(username)
    
    let doneButton = app.toolbars.buttons["Done"]
    if doneButton.exists {
      doneButton.tap()
    }
    
    let passwordField = webView.secureTextFields.allElementsBoundByIndex.first { $0.frame.width >= usernameField.frame.width }!
    passwordField.tap()

    UIPasteboard.general.string = "1234567"
    passwordField.doubleTap()
    app.menuItems["Paste"].tap()
    
    signInButton.tap()
    
    app.buttons["Cancel"].tap()
    
    XCTAssertFalse(logoutButton.waitForExistence(timeout: .testing))
    XCTAssertTrue(loginButton.waitForExistence(timeout: .testing))
  }
  
  func testGetUserFromTokens() throws {
    // given
    try testLoginFlow()
    // when
    let idTokenButton = app.buttons["getUserFromIdToken"]
    let requestButton = app.buttons["getUserFromRequest"]
    let accessTokenButton = app.buttons["getMyUserFromAccessToken"]
    let clearButton = app.buttons["clearButton"]
    // then
    XCTAssertTrue(idTokenButton.waitForExistence(timeout: .testing) && idTokenButton.isHittable)
    XCTAssertTrue(requestButton.waitForExistence(timeout: .testing) && requestButton.isHittable)
    XCTAssertTrue(accessTokenButton.waitForExistence(timeout: .testing) && accessTokenButton.isHittable)
    XCTAssertTrue(clearButton.waitForExistence(timeout: .testing) && clearButton.isHittable)
    
    let descriptionBox = app.staticTexts["descriptionBox"]

    idTokenButton.tap()
    XCTAssertTrue(descriptionBox.waitForExistence(timeout: .testing))
    XCTAssertTrue(descriptionBox.label.contains(username))
    clearButton.tap()
    
    XCTAssertFalse(descriptionBox.exists)
    requestButton.tap()
    XCTAssertFalse(descriptionBox.label.isEmpty)
    clearButton.tap()
    
    XCTAssertFalse(descriptionBox.exists)
    accessTokenButton.tap()
    XCTAssertFalse(descriptionBox.label.isEmpty)
    clearButton.tap()
  }
  
  func testLogoutFlow() throws {
    // given
    try testLoginFlow()
    // then
    logoutIfPossible(throwError: true)
  }
  
  private func logoutIfPossible(throwError: Bool = false) {
    guard logoutButton.waitForExistence(timeout: 10) else {
      XCTAssertFalse(throwError)
      return
    }
    
    logoutButton.tap()
    
    XCTAssertTrue(springboardContinueButton.waitForExistence(timeout: .testing))
    springboardContinueButton.tap()
    
    XCTAssertTrue(loginButton.waitForExistence(timeout: .testing))
  }
}

private extension TimeInterval {
  
  static let testing: TimeInterval = 20
}

