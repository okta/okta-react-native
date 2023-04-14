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
package com.e2eoktareactnative.login

import androidx.test.ext.junit.rules.activityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.e2eoktareactnative.MainActivity
import com.e2eoktareactnative.test.EndToEndCredentials
import com.e2eoktareactnative.web.WebPage
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
internal class BrowserLoginTest {
    @get:Rule
    val activityRule = activityScenarioRule<MainActivity>()

    private val testUsername = EndToEndCredentials.get("username")
    private val testPassword = EndToEndCredentials.get("password")

    @Before
    fun clearWebData() {
        WebPage.clearData()
    }

    @Test
    fun testLoginPageExists() {
        LoginPage()
    }

    @Test
    fun testBrowserLogin() {
        LoginPage().browserLogin()
            .username(testUsername)
            .password(testPassword)
            .login()
    }

    @Test
    fun testFailedBrowserLogin() {
        LoginPage().browserLogin()
            .username(testUsername)
            .password("wrongPassword")
            .loginExpectingError()
            .assertHasError("Unable to sign in")
            .cancel()
    }

    @Test
    fun testBrowserLogout() {
        LoginPage().browserLogin()
            .username(testUsername)
            .password(testPassword)
            .login()
            .logout()
    }
}
