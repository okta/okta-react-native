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
package com.e2eoktareactnative.test

import android.widget.EditText
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.UiDevice
import androidx.test.uiautomator.UiObject
import androidx.test.uiautomator.UiSelector
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import kotlin.time.Duration.Companion.seconds

fun clickButtonWithText(text: String, timeout: Long? = null) {
    clickButtonWithSelector(UiSelector().text(text), timeout)
}

fun clickButtonWithTextMatching(text: String, timeout: Long? = null) {
    clickButtonWithSelector(UiSelector().textMatches(text), timeout)
}

fun clickButtonWithSelector(selector: UiSelector, timeout: Long? = null) {
    applyOnViewWithSelector(selector) { uiObject ->
        timeout?.let {
            assertThat(uiObject.waitForExists(timeout), equalTo(true))
        }
        assertThat(uiObject.click(), equalTo(true))
    }
}

fun setTextForIndex(index: Int, text: String) {
    val uiDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
    val selector = UiSelector().className(EditText::class.java).instance(index)
    assertThat(uiDevice.findObject(selector).setText(text), equalTo(true))
}

fun waitForText(text: String, timeout: Long = 10.seconds.inWholeMilliseconds) {
    waitForViewWithSelector(UiSelector().text(text), timeout)
}

fun waitForTextMatching(text: String, timeout: Long = 10.seconds.inWholeMilliseconds) {
    waitForViewWithSelector(UiSelector().textMatches(text), timeout)
}

fun waitForResourceIdWithText(resourceId: String, text: String, timeout: Long = 10.seconds.inWholeMilliseconds) {
    waitForViewWithSelector(UiSelector().resourceIdMatches(resourceId).text(text), timeout)
}

fun waitForResourceId(resourceId: String, timeout: Long = 10.seconds.inWholeMilliseconds) {
    waitForViewWithSelector(UiSelector().resourceIdMatches(resourceId), timeout)
}

fun waitForViewWithSelector(selector: UiSelector, timeout: Long = 10.seconds.inWholeMilliseconds) {
    applyOnViewWithSelector(selector) { uiObject ->
        assertThat(uiObject.waitForExists(timeout), equalTo(true))
    }
}

fun applyOnViewWithSelector(selector: UiSelector, uiObjectFunction: (UiObject) -> Unit) {
    val uiDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
    uiObjectFunction(uiDevice.findObject(selector))
}
