/*
 * Copyright 2023-Present Okta, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.e2eoktareactnative.customlogin

import androidx.test.uiautomator.UiSelector
import com.e2eoktareactnative.dashboard.DashboardPage
import com.e2eoktareactnative.test.applyOnViewWithSelector
import com.e2eoktareactnative.test.clickButtonWithText
import com.e2eoktareactnative.test.setTextForIndex
import com.e2eoktareactnative.test.waitForText
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import kotlin.time.Duration.Companion.seconds

internal class CustomLoginPage {
    init {
        waitForText("CustomLogin", timeout = 10L.seconds.inWholeMilliseconds)
    }

    fun username(username: String): CustomLoginPage {
        setTextForIndex(0, username)
        return this
    }

    fun password(password: String): CustomLoginPage {
        setTextForIndex(1, password)
        return this
    }

    fun login(): DashboardPage {
        clickButtonWithText("SIGN IN")
        return DashboardPage()
    }

    fun loginExpectingError(): CustomLoginPage {
        clickButtonWithText("SIGN IN")
        return this
    }

    fun assertHasError(error: String): CustomLoginPage {
        waitForText(error)
        return this
    }

    fun pressAlertOkButton(): CustomLoginPage {
        applyOnViewWithSelector(UiSelector().text("OK")) { uiObject ->
            assertThat(uiObject.waitForExists(10.seconds.inWholeMilliseconds), equalTo(true))
            // Checking if clicking "OK" was successful doesn't work on CI device. As an alternative,
            // click OK button, and check if the button is no longer visible afterwards
            uiObject.click()
            assertThat(uiObject.waitForExists(2.seconds.inWholeMilliseconds), equalTo(false))
        }
        waitForText("CustomLogin", timeout = 10.seconds.inWholeMilliseconds)
        return this
    }
}
