/*
 * Copyright (c) 2022-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
package com.oktareactnative

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.text.TextUtils
import com.facebook.react.bridge.*
import com.okta.oidc.AuthenticationPayload
import com.okta.oidc.OIDCConfig
import com.okta.oidc.OktaResultFragment
import com.okta.oidc.Tokens
import com.okta.oidc.clients.AuthClient
import com.okta.oidc.clients.sessions.SessionClient
import com.okta.oidc.clients.web.WebAuthClient
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatchers.*
import org.mockito.Mockito
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner

@RunWith(PowerMockRunner::class)
@PrepareForTest(
    TextUtils::class,
    Arguments::class,
    WebAuthClientFactory::class,
    AuthClientFactory::class,
    Uri::class
)
class OktaSdkBridgeTest {

    private var mContext: ReactApplicationContext? = null

    private var mockedWebAuthClient: WebAuthClient? = null
    private var mockedAuthClient: AuthClient? = null

    @Before
    fun setUp() {
        PowerMockito.mockStatic(TextUtils::class.java)
        PowerMockito.`when`(TextUtils.isEmpty(any(CharSequence::class.java)))
            .thenAnswer { invocation ->
                val a = invocation.arguments[0] as CharSequence
                return@thenAnswer a.isEmpty()
            }
        mContext = Mockito.mock(ReactApplicationContext::class.java)

        mockedWebAuthClient = Mockito.mock(WebAuthClient::class.java)
        mockedAuthClient = Mockito.mock(AuthClient::class.java)

        PowerMockito.mockStatic(WebAuthClientFactory::class.java)
        PowerMockito.`when`(WebAuthClientFactory.getWebAuthClient(
            any(OIDCConfig::class.java),
            any(Context::class.java),
            anyBoolean(),
            anyString(),
            anyBoolean(),
            anyString(),
            anyInt(),
            anyInt()
        )).thenAnswer {
            return@thenAnswer mockedWebAuthClient
        }

        PowerMockito.mockStatic(AuthClientFactory::class.java)
        PowerMockito.`when`(AuthClientFactory.getAuthClient(
            any(OIDCConfig::class.java),
            any(Context::class.java),
            anyBoolean(),
            anyString(),
            anyInt(),
            anyInt()
        )).thenAnswer {
            return@thenAnswer mockedAuthClient
        }
    }

    @Test
    fun configCreated() {
        val promise = Mockito.mock(Promise::class.java)

        createConfig(promise)

        Mockito
            .verify(promise, Mockito.times(1))
            .resolve(true)
    }

    @Test
    fun testSignIn() {
        val promise = Mockito.mock(Promise::class.java)
        val map = Mockito.mock(ReadableMap::class.java)
        val activityMock = Mockito.mock(Activity::class.java)
        Mockito.`when`(mContext!!.currentActivity).thenAnswer { activityMock }

        val bridge = createConfig(promise)
        bridge.signIn(map, promise)

        Mockito
            .verify(mockedWebAuthClient!!, Mockito.times(1))
            .signIn(eq(activityMock), any(AuthenticationPayload::class.java))
    }

    @Test
    fun testSignOut() {
        val promise = Mockito.mock(Promise::class.java)
        val activityMock = Mockito.mock(Activity::class.java)
        Mockito.`when`(mContext!!.currentActivity).thenAnswer { activityMock }

        val bridge = createConfig(promise)
        bridge.signOut(promise)

        Mockito
            .verify(mockedWebAuthClient!!, Mockito.times(1))
            .signOutOfOkta(activityMock)
    }

    /* region Tests for request code recalculation */

    @Test
    fun `request code corresponds to sign_in when sign_in invoked`() {
        val promise = Mockito.mock(Promise::class.java)
        val bridge = createConfig(promise)

        val optionsMap = Mockito.mock(ReadableMap::class.java)
        val activityMock = Mockito.mock(Activity::class.java)
        Mockito.`when`(mContext!!.currentActivity).thenAnswer { activityMock }
        bridge.signIn(optionsMap, promise)

        val callbackUri = "callbackUri"

        val initialRequestCode = Integer.MAX_VALUE
        val resultCode = Activity.RESULT_OK
        val intentMock = Mockito.mock(Intent::class.java)
        Mockito.`when`(intentMock.dataString).thenAnswer { callbackUri }

        val uri = getUriMock()
        Mockito.`when`(uri.toString()).thenAnswer { callbackUri }
        val expectedRequestCode = OktaResultFragment.REQUEST_CODE_SIGN_IN

        bridge.onActivityResult(
            activityMock,
            initialRequestCode,
            resultCode,
            intentMock
        )

        Mockito.verify(
            mockedWebAuthClient!!, Mockito.times(1)
        ).handleActivityResult(
            expectedRequestCode,
            resultCode,
            intentMock
        )
    }

    @Test
    fun `request code corresponds to sign_out when sign_out invoked`() {
        val promise = Mockito.mock(Promise::class.java)
        val bridge = createConfig(promise)

        val activityMock = Mockito.mock(Activity::class.java)
        Mockito.`when`(mContext!!.currentActivity).thenAnswer { activityMock }
        bridge.signOut(promise)

        val endSessionRedirectUri = "endSessionRedirectUri"

        val initialRequestCode = Integer.MAX_VALUE
        val resultCode = Activity.RESULT_OK
        val intentMock = Mockito.mock(Intent::class.java)
        Mockito.`when`(intentMock.dataString).thenAnswer { endSessionRedirectUri }

        val uri = getUriMock()
        Mockito.`when`(uri.toString()).thenAnswer { endSessionRedirectUri }
        val expectedRequestCode = OktaResultFragment.REQUEST_CODE_SIGN_OUT

        bridge.onActivityResult(
            activityMock,
            initialRequestCode,
            resultCode,
            intentMock
        )

        Mockito.verify(
            mockedWebAuthClient!!, Mockito.times(1)
        ).handleActivityResult(
            expectedRequestCode,
            resultCode,
            intentMock
        )
    }

    /* endregion Tests for request code recalculation */

    @Test
    fun testAdditionalParametersPassedForSignIn() {
        val promise = Mockito.mock(Promise::class.java)
        val map = Mockito.mock(ReadableMap::class.java)

        Mockito.`when`(map.hasKey("idp")).thenAnswer { true }
        Mockito.`when`(map.hasKey("prompt")).thenAnswer { true }
        Mockito.`when`(map.hasKey("login_hint")).thenAnswer { true }
        val expectedIdp = "provider"
        val expectedPrompt = "consent"
        val expectedLoginHint = "consent"
        Mockito.`when`(map.getString("idp")).thenAnswer { expectedIdp }
        Mockito.`when`(map.getString("prompt")).thenAnswer { expectedPrompt }
        Mockito.`when`(map.getString("login_hint")).thenAnswer { expectedLoginHint }

        val activityMock = Mockito.mock(Activity::class.java)
        Mockito.`when`(mContext!!.currentActivity).thenAnswer { activityMock }

        val bridge = createConfig(promise)
        bridge.signIn(map, promise)

        val captor = ArgumentCaptor.forClass(AuthenticationPayload::class.java)
        Mockito
            .verify(mockedWebAuthClient!!, Mockito.times(1))
            .signIn(eq(activityMock), captor.capture())
        assertEquals(expectedLoginHint, captor.value.loginHint)
        assertTrue(
            captor.value.additionalParameters.containsKey("prompt") &&
                captor.value.additionalParameters.containsValue(expectedPrompt)
        )
        assertTrue(
            captor.value.additionalParameters.containsKey("idp") &&
                captor.value.additionalParameters.containsValue(expectedIdp)
        )
    }

    /* region token tests */

    @Test
    fun testGetAccessToken() {
        val promise = Mockito.mock(Promise::class.java)
        val bridge = createConfig(promise)

        val mockedTokens = getMockedTokens()
        Mockito.`when`(mockedTokens.isAccessTokenExpired).thenAnswer { false }
        val accessToken = "accessTokenValue"
        Mockito.`when`(mockedTokens.accessToken).thenAnswer { accessToken }
        val expectedPromiseResolvedValue = JavaOnlyMap()
        expectedPromiseResolvedValue.putString("access_token", accessToken)

        PowerMockito.mockStatic(Arguments::class.java)
        PowerMockito.`when`(Arguments.createMap()).thenAnswer { JavaOnlyMap() }
        bridge.getAccessToken(promise)
        Mockito.verify(
            promise, Mockito.times(1)
        ).resolve(
            expectedPromiseResolvedValue
        )
    }

    @Test
    fun `rejects promise when access token expired`() {
        val promise = Mockito.mock(Promise::class.java)
        val bridge = createConfig(promise)

        val mockedTokens = getMockedTokens()
        Mockito.`when`(mockedTokens.isAccessTokenExpired).thenAnswer { true }

        PowerMockito.mockStatic(Arguments::class.java)
        PowerMockito.`when`(Arguments.createMap()).thenAnswer { JavaOnlyMap() }
        bridge.getAccessToken(promise)

        Mockito.verify(
            promise, Mockito.times(1)
        ).reject(
            OktaSdkError.NO_ACCESS_TOKEN.errorCode,
            OktaSdkError.NO_ACCESS_TOKEN.errorMessage
        )
    }

    @Test
    fun testGetIdToken() {
        val promise = Mockito.mock(Promise::class.java)
        val bridge = createConfig(promise)

        val mockedTokens = getMockedTokens()
        val idTokenValue = "idTokenValue"
        Mockito.`when`(mockedTokens.idToken).thenAnswer { idTokenValue }
        val expectedPromiseResolvedValue = JavaOnlyMap()
        expectedPromiseResolvedValue.putString("id_token", idTokenValue)

        PowerMockito.mockStatic(Arguments::class.java)
        PowerMockito.`when`(Arguments.createMap()).thenAnswer { JavaOnlyMap() }
        bridge.getIdToken(promise)
        Mockito.verify(
            promise, Mockito.times(1)
        ).resolve(
            expectedPromiseResolvedValue
        )
    }

    @Test
    fun `rejects promise when id token absent`() {
        val promise = Mockito.mock(Promise::class.java)
        val bridge = createConfig(promise)

        val mockedTokens = getMockedTokens()
        Mockito.`when`(mockedTokens.idToken).thenAnswer { null }

        PowerMockito.mockStatic(Arguments::class.java)
        PowerMockito.`when`(Arguments.createMap()).thenAnswer { JavaOnlyMap() }
        bridge.getIdToken(promise)

        Mockito.verify(
            promise, Mockito.times(1)
        ).reject(
            OktaSdkError.NO_ID_TOKEN.errorCode,
            OktaSdkError.NO_ID_TOKEN.errorMessage
        )
    }

    /* endregion token tests */

    private fun createConfig(promise: Promise): OktaSdkBridgeModule {
        val oktaSdkBridgeModule = OktaSdkBridgeModule(mContext!!)
        val userAgentTemplate = ""
        val requireHardwareBackedKeyStore = false
        val timeouts: ReadableMap = JavaOnlyMap.of(*emptyArray<String>())
        val browserMatchAll = false
        val scopes: ReadableArray = JavaOnlyArray.of(*SCOPES)

        oktaSdkBridgeModule.createConfig(
            CLIENT_ID,
            REDIRECT_URI,
            END_SESSION_URI,
            CUSTOM_URL,
            scopes,
            userAgentTemplate,
            requireHardwareBackedKeyStore,
            Color.BLACK.toString(),
            timeouts,
            browserMatchAll,
            promise
        )

        return oktaSdkBridgeModule
    }

    private fun getUriMock(): Uri {
        val uriMock = Mockito.mock(Uri::class.java)
        PowerMockito.mockStatic(Uri::class.java)
        PowerMockito.`when`(Uri.parse(anyString()))
            .thenAnswer { uriMock }
        return uriMock
    }

    private fun getMockedTokens(): Tokens {
        val mockedSessionClient = Mockito.mock(SessionClient::class.java)
        Mockito.`when`(mockedWebAuthClient!!.sessionClient).thenAnswer { mockedSessionClient }
        val mockedTokens = Mockito.mock(Tokens::class.java)
        Mockito.`when`(mockedSessionClient.tokens).thenAnswer { mockedTokens }
        return mockedTokens
    }

    companion object {
        const val CUSTOM_URL = "https://com.okta.test/"
        const val CLIENT_ID = "CLIENT_ID"
        const val REDIRECT_URI = CUSTOM_URL + "callback"
        const val END_SESSION_URI = CUSTOM_URL + "logout"
        val SCOPES = arrayOf<String?>("openid", "profile", "offline_access")
    }
}