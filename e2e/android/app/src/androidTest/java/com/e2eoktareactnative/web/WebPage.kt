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
package com.e2eoktareactnative.web

import android.app.Application
import android.content.Intent
import android.net.Uri
import androidx.test.core.app.ApplicationProvider
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.By
import androidx.test.uiautomator.UiDevice
import androidx.test.uiautomator.UiSelector
import androidx.test.uiautomator.Until
import com.e2eoktareactnative.dashboard.DashboardPage
import com.e2eoktareactnative.test.clickButtonWithSelector
import com.e2eoktareactnative.test.clickButtonWithText
import com.e2eoktareactnative.test.clickButtonWithTextMatching
import com.e2eoktareactnative.test.execShellCommand
import com.e2eoktareactnative.test.setTextForIndex
import com.e2eoktareactnative.test.waitForText
import timber.log.Timber
import kotlin.time.Duration.Companion.seconds

internal class WebPage<PreviousPage>(
    private val previousPage: PreviousPage,
    initialText: String = "Sign In"
) {
    companion object {
        // The login button text can also be "Sign in" with lower case 'i', depending on backend
        private val loginButtonSelector = UiSelector().text("Sign In").clickable(true)

        fun clearData() {
            execShellCommand("pm clear com.android.chrome")
            Thread.sleep(2.seconds.inWholeMilliseconds)

            val application = ApplicationProvider.getApplicationContext<Application>()
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://okta.com"))
            val buttonTimeout = 1.seconds.inWholeMilliseconds
            browserIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            application.startActivity(browserIntent)

            try {
                clickButtonWithText("Use without an account", buttonTimeout)
            } catch (e: Throwable) {
                Timber.e(e, "Error calling Use without an account")
            }

            try {
                clickButtonWithText("Accept & continue", buttonTimeout)
            } catch (e: Throwable) {
                Timber.e(e, "Error Calling accept and continue")
            }

            try {
                clickButtonWithTextMatching("No [t|T]hanks", buttonTimeout)
            } catch (e: Throwable) {
                Timber.e(e, "Error Calling No thanks")
            }

            Thread.sleep(1.seconds.inWholeMilliseconds)
            execShellCommand("am force-stop com.android.chrome")
            Thread.sleep(1.seconds.inWholeMilliseconds)
        }
    }

    init {
        waitForText(initialText)
    }

    fun username(username: String): WebPage<PreviousPage> {
        setTextForIndex(0, username)
        return this
    }

    fun password(password: String): WebPage<PreviousPage> {
        setTextForIndex(1, password)
        return this
    }

    fun login(): DashboardPage {
        clickButtonWithSelector(loginButtonSelector, timeout = 10.seconds.inWholeMilliseconds)
        return DashboardPage()
    }

    fun loginExpectingError(): WebPage<PreviousPage> {
        clickButtonWithSelector(loginButtonSelector, timeout = 10.seconds.inWholeMilliseconds)
        return this
    }

    fun cancel(): PreviousPage {
        val device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
        device.pressBack()
        device.wait(Until.findObject(By.pkg("com.e2eoktareactnative")), 2_000)
        return previousPage
    }

    fun assertHasError(error: String): WebPage<PreviousPage> {
        waitForText(error)
        return this
    }
}
