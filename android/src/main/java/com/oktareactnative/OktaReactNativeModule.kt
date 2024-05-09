package com.oktareactnative

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Color
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.okta.oidc.AuthenticationPayload
import com.okta.oidc.AuthorizationStatus
import com.okta.oidc.OIDCConfig
import com.okta.oidc.Okta
import com.okta.oidc.OktaBuilder
import com.okta.oidc.OktaIdToken
import com.okta.oidc.OktaResultFragment.REQUEST_CODE_SIGN_IN
import com.okta.oidc.OktaResultFragment.REQUEST_CODE_SIGN_OUT
import com.okta.oidc.RequestCallback
import com.okta.oidc.ResultCallback
import com.okta.oidc.Tokens
import com.okta.oidc.clients.AuthClient
import com.okta.oidc.clients.sessions.SessionClient
import com.okta.oidc.clients.web.WebAuthClient
import com.okta.oidc.net.params.TokenTypeHint
import com.okta.oidc.net.response.IntrospectInfo
import com.okta.oidc.net.response.UserInfo
import com.okta.oidc.results.Result
import com.okta.oidc.storage.SharedPreferenceStorage
import com.okta.oidc.util.AuthorizationException
import java.io.PrintWriter
import java.io.StringWriter


class OktaReactNativeModule internal constructor(reactContext: ReactApplicationContext) :
  OktaReactNativeSpec(reactContext), ActivityEventListener {

  private var listenerCount = 0
  private var config: OIDCConfig? = null
  private var webClient: WebAuthClient? = null
  private var authClient: AuthClient? = null
  private var sessionClient: SessionClient? = null
  private var queuedPromise: Promise? = null
  private val reactContext: ReactApplicationContext = reactContext
  private var mLastRequestType: LastRequestType? = null
  private val sharedPreferences: SharedPreferences =
    reactContext.getSharedPreferences(SESSION_CLIENT_SHARED_PREFS, Context.MODE_PRIVATE)
  private val sharedPreferencesEditor: SharedPreferences.Editor = sharedPreferences.edit()

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "OktaReactNative"
    const val SESSION_CLIENT_SHARED_PREFS = "OKTA_SDK_BRIDGE_MODULE_SESSION_CLIENT"
    const val PREFS_KEY = "SESSION_CLIENT"
    const val SESSION_CLIENT_AUTH = "AUTH"
    const val SESSION_CLIENT_WEB = "WEB"
  }


  @ReactMethod
  override fun createConfig(
    options: ReadableMap,
    successCallback: Callback,
    errorCallback: Callback,
    ) {
    try {
      val clientId = options.getString("clientId")!!
      val redirectUri = options.getString("redirectUri")!!
      val endSessionRedirectUri = options.getString("endSessionRedirectUri")!!
      val discoveryUri = options.getString("discoveryUri")!!
      val scopes = options.getArray("scopes")!!
      val userAgentTemplate = options.getString("userAgentTemplate")!!
      val requireHardwareBackedKeyStore = options.getBoolean("requireHardwareBackedKeyStore")!!
      val timeouts = options.getMap("timeouts")!!
      val browserMatchAll = options.getBoolean("browserMatchAll")
      val androidChromeTabColor = options.getString("androidChromeTabColor")

      val connectTimeout = 1000 * resolveTimeout(timeouts, "httpConnectionTimeout", 15)
      val readTimeout = 1000 * resolveTimeout(timeouts, "httpReadTimeout", 10)
      val scopeArray = arrayOfNulls<String>(scopes.size())
      for (i in 0 until scopes.size()) {
        scopeArray[i] = scopes.getString(i)
      }
      config = OIDCConfig.Builder()
        .clientId(clientId!!)
        .redirectUri(redirectUri!!)
        .endSessionRedirectUri(endSessionRedirectUri!!)
        .scopes(*scopeArray)
        .discoveryUri(discoveryUri!!)
        .create()
      val webAuthBuilder = Okta.WebAuthBuilder()
      configureBuilder(
        webAuthBuilder,
        userAgentTemplate,
        requireHardwareBackedKeyStore,
        connectTimeout,
        readTimeout
      )
      if (androidChromeTabColor != null) {
        try {
          webAuthBuilder.withTabColor(Color.parseColor(androidChromeTabColor))
        } catch (e: java.lang.IllegalArgumentException) {
          // The color wasn't in the right format.
          errorCallback.invoke(
            OktaSdkError.OKTA_OIDC_ERROR.errorCode,
            e.localizedMessage,
            getStackTraceString(e)
          )
        }
      }
      if (browserMatchAll != null && browserMatchAll) {
        webAuthBuilder.browserMatchAll(true)
      }
      webClient = webAuthBuilder.create()
      val authClientBuilder = Okta.AuthBuilder()
      configureBuilder(
        authClientBuilder,
        userAgentTemplate,
        requireHardwareBackedKeyStore,
        connectTimeout,
        readTimeout
      )
      authClient = authClientBuilder.create()
      successCallback.invoke(true)
      sessionClient =
        if (SESSION_CLIENT_WEB.equals(sharedPreferences.getString(PREFS_KEY, SESSION_CLIENT_WEB))) {
          webClient?.getSessionClient()
        } else {
          authClient?.getSessionClient()
        }
    } catch (e: java.lang.Exception) {
      errorCallback.invoke(
        OktaSdkError.OKTA_OIDC_ERROR.errorCode,
        e.localizedMessage,
        getStackTraceString(e)
      )
    }
  }

  private fun resolveTimeout(timeouts: ReadableMap, key: String, defaultValue: Int): Int {
    return if (!timeouts.hasKey(key)) {
      defaultValue
    } else {
      val timeout = timeouts.getInt(key)
      if (timeout < 0) {
        defaultValue
      } else timeout
    }
  }

  private fun <T : OktaBuilder<*, T>?> configureBuilder(
    builder: T,
    userAgentTemplate: String,
    requireHardwareBackedKeyStore: Boolean,
    connectTimeoutMs: Int,
    readTimeoutMs: Int
  ) {
    builder!!.withConfig(config!!)
      ?.withOktaHttpClient(
        com.oktareactnative.HttpClientImpl(
          userAgentTemplate,
          connectTimeoutMs,
          readTimeoutMs
        )
      )
      ?.withContext(reactContext)
      ?.withStorage(SharedPreferenceStorage(reactContext))
      ?.setRequireHardwareBackedKeyStore(requireHardwareBackedKeyStore)
  }


  @ReactMethod
  override fun signIn(
    options: ReadableMap,
    promise: Promise
  ) {

    val currentActivity = currentActivity
    if (currentActivity == null) {
      val params = Arguments.createMap()
      params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NO_VIEW.errorCode)
      params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NO_VIEW.errorMessage)
      sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
      promise.reject(OktaSdkError.NO_VIEW.errorCode, OktaSdkError.NO_VIEW.errorMessage)
      return
    }
    if (webClient == null) {
      val params = Arguments.createMap()
      params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NOT_CONFIGURED.errorCode)
      params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NOT_CONFIGURED.errorMessage)
      sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
      promise.reject(
        OktaSdkError.NOT_CONFIGURED.errorCode,
        OktaSdkError.NOT_CONFIGURED.errorMessage
      )
      return
    }
    val payloadBuilder = AuthenticationPayload.Builder()
    if (options.hasKey("idp")) {
      payloadBuilder.setIdp(options.getString("idp"))
    }
    if (options.hasKey("prompt")) {
      payloadBuilder.addParameter("prompt", options.getString("prompt")!!)
    }
    if (options.hasKey("login_hint")) {
      payloadBuilder.setLoginHint(options.getString("login_hint"))
    }
    queuedPromise = promise
    mLastRequestType = LastRequestType.SIGN_IN
    webClient!!.signIn(currentActivity, payloadBuilder.build())
  }

  @ReactMethod
  override fun authenticate(sessionToken: String, promise: Promise) {
    if (authClient == null) {
      val params = Arguments.createMap()
      params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NOT_CONFIGURED.errorCode)
      params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NOT_CONFIGURED.errorMessage)
      sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
      promise.reject(
        OktaSdkError.NOT_CONFIGURED.errorCode,
        OktaSdkError.NOT_CONFIGURED.errorMessage
      )
      return
    }
    authClient!!.signIn(
      sessionToken,
      null,
      object : RequestCallback<Result, AuthorizationException?> {
        override fun onSuccess(result: Result) {
          if (result.isSuccess()) {
            try {
              sharedPreferencesEditor.putString(PREFS_KEY, SESSION_CLIENT_AUTH).apply()
              sessionClient = authClient!!.sessionClient
              val tokens = sessionClient!!.getTokens()
              val token = tokens.accessToken
              var params = Arguments.createMap()
              params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.AUTHORIZED)
              params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, token)
              sendEvent(reactContext, OktaSdkConstant.SIGN_IN_SUCCESS, params)
              params = Arguments.createMap()
              params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.AUTHORIZED)
              params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, token)
              promise.resolve(params)
            } catch (e: AuthorizationException) {
              sharedPreferencesEditor.clear().apply()
              val params = Arguments.createMap()
              params.putString(
                OktaSdkConstant.ERROR_CODE_KEY,
                OktaSdkError.SIGN_IN_FAILED.errorCode
              )
              params.putString(
                OktaSdkConstant.ERROR_MSG_KEY,
                OktaSdkError.SIGN_IN_FAILED.errorMessage
              )
              params.putString(OktaSdkConstant.ERROR_STACK_TRACE_KEY, getStackTraceString(e))
              sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
              promise.reject(
                OktaSdkError.SIGN_IN_FAILED.errorCode,
                OktaSdkError.SIGN_IN_FAILED.errorMessage,
                e
              )
            }
          } else {
            sharedPreferencesEditor.clear().apply()
            val params = Arguments.createMap()
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.SIGN_IN_FAILED.errorCode)
            params.putString(
              OktaSdkConstant.ERROR_MSG_KEY,
              OktaSdkError.SIGN_IN_FAILED.errorMessage
            )
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
            promise.reject(
              OktaSdkError.SIGN_IN_FAILED.errorCode,
              OktaSdkError.SIGN_IN_FAILED.errorMessage
            )
          }
        }

        override fun onError(error: String, exception: AuthorizationException?) {
          sharedPreferencesEditor.clear().apply()
          val params = Arguments.createMap()
          params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.OKTA_OIDC_ERROR.errorCode)
          params.putString(OktaSdkConstant.ERROR_MSG_KEY, error)
          params.putString(OktaSdkConstant.ERROR_STACK_TRACE_KEY,
            exception?.let { getStackTraceString(it) })
          sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
          promise.reject(
            OktaSdkError.OKTA_OIDC_ERROR.errorCode,
            OktaSdkError.OKTA_OIDC_ERROR.errorMessage,
            exception
          )
        }
      })
  }

  @ReactMethod
  override fun getAccessToken(promise: Promise) {
    try {
      if (sessionClient == null) {
        promise.reject(
          OktaSdkError.NOT_CONFIGURED.errorCode,
          OktaSdkError.NOT_CONFIGURED.errorMessage
        )
        return
      }
      val params = Arguments.createMap()
      val tokens = sessionClient!!.tokens
      val accessToken =
        if (tokens == null || tokens.isAccessTokenExpired()) null else tokens.accessToken
      if (accessToken != null) {
        params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, accessToken)
        promise.resolve(params)
      } else {
        promise.reject(
          OktaSdkError.NO_ACCESS_TOKEN.errorCode,
          OktaSdkError.NO_ACCESS_TOKEN.errorMessage
        )
      }
    } catch (e: java.lang.Exception) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  @ReactMethod
  override fun getIdToken(promise: Promise) {
    try {
      if (sessionClient == null) {
        promise.reject(
          OktaSdkError.NOT_CONFIGURED.errorCode,
          OktaSdkError.NOT_CONFIGURED.errorMessage
        )
        return
      }
      val params = Arguments.createMap()
      val tokens = sessionClient!!.tokens
      val idToken = tokens.idToken
      if (idToken != null) {
        params.putString(OktaSdkConstant.ID_TOKEN_KEY, idToken)
        promise.resolve(params)
      } else {
        promise.reject(OktaSdkError.NO_ID_TOKEN.errorCode, OktaSdkError.NO_ID_TOKEN.errorMessage)
      }
    } catch (e: java.lang.Exception) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  @ReactMethod
  override fun getUser(promise: Promise) {
    if (sessionClient == null) {
      promise.reject(
        OktaSdkError.NOT_CONFIGURED.errorCode,
        OktaSdkError.NOT_CONFIGURED.errorMessage
      )
      return
    }
    sessionClient!!.getUserProfile(object : RequestCallback<UserInfo, AuthorizationException> {
      override fun onSuccess(result: UserInfo) {
        promise.resolve(result.toString())
      }

      override fun onError(msg: String, error: AuthorizationException) {
        promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, error.localizedMessage, error)
      }
    })
  }

  @ReactMethod
  override fun isAuthenticated(promise: Promise) {
    try {
      if (sessionClient == null) {
        promise.reject(
          OktaSdkError.NOT_CONFIGURED.errorCode,
          OktaSdkError.NOT_CONFIGURED.errorMessage
        )
        return
      }
      val params = Arguments.createMap()
      val tokens = sessionClient!!.tokens
      if (tokens == null) {
        params.putBoolean(OktaSdkConstant.AUTHENTICATED_KEY, false)
        promise.resolve(params)
        return
      }
      val isAccessTokenAvailable = tokens.accessToken != null && !tokens.isAccessTokenExpired()
      val isAuthenticated = isAccessTokenAvailable && isIdTokenNotExpired(tokens.idToken)
      params.putBoolean(OktaSdkConstant.AUTHENTICATED_KEY, isAuthenticated)
      promise.resolve(params)
    } catch (e: java.lang.Exception) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  @ReactMethod
  override fun signOut(
    promise: Promise
  ) {
    val currentActivity = currentActivity
    if (currentActivity == null) {
      val params = Arguments.createMap()
      params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NO_VIEW.errorCode)
      params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NO_VIEW.errorMessage)
      sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
      promise.reject(OktaSdkError.NO_VIEW.errorCode, OktaSdkError.NO_VIEW.errorMessage)
      return
    }
    if (webClient == null) {
      val params = Arguments.createMap()
      params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NOT_CONFIGURED.errorCode)
      params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NOT_CONFIGURED.errorMessage)
      sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
      promise.reject(
        OktaSdkError.NOT_CONFIGURED.errorCode,
        OktaSdkError.NOT_CONFIGURED.errorMessage
      )
      return
    }
    queuedPromise = promise
    mLastRequestType = LastRequestType.SIGN_OUT
    webClient!!.signOutOfOkta(currentActivity)
  }

  @ReactMethod
  override fun revokeAccessToken(promise: Promise) {
    revokeToken(TokenTypeHint.ACCESS_TOKEN, promise!!)
  }

  @ReactMethod
  override fun revokeIdToken(promise: Promise) {
    revokeToken(TokenTypeHint.ID_TOKEN, promise!!)
  }

  @ReactMethod
  override fun revokeRefreshToken(promise: Promise) {
    revokeToken(TokenTypeHint.REFRESH_TOKEN, promise!!)
  }

  @ReactMethod
  override fun introspectAccessToken(promise: Promise) {
    introspectToken(TokenTypeHint.ACCESS_TOKEN, promise!!)
  }

  @ReactMethod
  override fun introspectIdToken(promise: Promise) {
    introspectToken(TokenTypeHint.ID_TOKEN, promise!!)
  }

  @ReactMethod
  override fun introspectRefreshToken(promise: Promise) {
    introspectToken(TokenTypeHint.REFRESH_TOKEN, promise!!)
  }

  @ReactMethod
  override fun refreshTokens(promise: Promise) {
    try {
      if (sessionClient == null) {
        promise.reject(
          OktaSdkError.NOT_CONFIGURED.errorCode,
          OktaSdkError.NOT_CONFIGURED.errorMessage
        )
        return
      }
      sessionClient!!.refreshToken(object : RequestCallback<Tokens, AuthorizationException> {
        override fun onSuccess(result: Tokens) {
          val params = Arguments.createMap()
          params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, result.accessToken)
          params.putString(OktaSdkConstant.ID_TOKEN_KEY, result.idToken)
          params.putString(OktaSdkConstant.REFRESH_TOKEN_KEY, result.refreshToken)
          promise.resolve(params)
        }

        override fun onError(e: String, error: AuthorizationException) {
          promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, error.localizedMessage, error)
        }
      })
    } catch (e: Error) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  @ReactMethod
  override fun clearTokens(promise: Promise) {
    try {
      if (webClient != null) {
        webClient!!.sessionClient.clear()
      }
      if (authClient != null) {
        authClient!!.sessionClient.clear()
      }
      promise.resolve(true)
    } catch (e: java.lang.Exception) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  @SuppressLint("RestrictedApi")
  private fun getRecalculatedRequestCodeForActivityResult(
    initialRequestCode: Int,
    resultCode: Int,
    data: Intent?
  ): Int {
    if (resultCode == Activity.RESULT_OK) {
      val callbackUri = (if (data != null) data.dataString else "") ?: return initialRequestCode
      if (LastRequestType.SIGN_IN === mLastRequestType &&
        callbackUri.startsWith(config!!.redirectUri.toString())
      ) {
        return REQUEST_CODE_SIGN_IN
      } else if (LastRequestType.SIGN_OUT === mLastRequestType &&
        callbackUri.startsWith(config!!.endSessionRedirectUri.toString())
      ) {
        return REQUEST_CODE_SIGN_OUT
      }
    } else if (resultCode == Activity.RESULT_CANCELED) {
      return REQUEST_CODE_SIGN_IN
    }
    return initialRequestCode
  }


  override fun onActivityResult(
    activity: Activity?,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
    if (activity == null) {
      val params = Arguments.createMap()
      params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NO_VIEW.errorCode)
      params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NO_VIEW.errorMessage)
      sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
      return
    }
    if (webClient != null) {
      val rc: Int = getRecalculatedRequestCodeForActivityResult(requestCode, resultCode, data)
      webClient?.handleActivityResult(rc, resultCode, data)
      registerCallback(activity)
    }
  }

  override fun onNewIntent(p0: Intent?) {
  }


  @ReactMethod
  override fun addListener(eventName: String) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  override fun removeListeners(count: Int) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  /**
   * ================= Private Methods =================
   **/

  private fun sendEvent(
    reactContext: ReactContext,
    eventName: String,
    params: WritableMap?
  ) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun registerCallback(activity: Activity) {
    webClient!!.registerCallback(object :
      ResultCallback<AuthorizationStatus, AuthorizationException> {
      override fun onSuccess(status: AuthorizationStatus) {
        val localSessionClient = webClient!!.sessionClient
        if (status == AuthorizationStatus.AUTHORIZED) {
          try {
            val params = Arguments.createMap()
            val tokens = localSessionClient.tokens
            params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.AUTHORIZED)
            params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, tokens.accessToken)
            queuedPromise?.resolve(params.copy())
            sendEvent(reactContext, OktaSdkConstant.SIGN_IN_SUCCESS, params)
            sessionClient = localSessionClient
            sharedPreferencesEditor.putString(PREFS_KEY, SESSION_CLIENT_WEB)
            queuedPromise = null
          } catch (e: AuthorizationException) {
            val params = Arguments.createMap()
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.SIGN_IN_FAILED.errorCode)
            params.putString(
              OktaSdkConstant.ERROR_MSG_KEY,
              OktaSdkError.SIGN_IN_FAILED.errorMessage
            )
            params.putString(OktaSdkConstant.ERROR_STACK_TRACE_KEY, getStackTraceString(e))
            queuedPromise?.reject(e)
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
            sharedPreferencesEditor.clear().apply()
            queuedPromise = null
          }
        } else if (status == AuthorizationStatus.SIGNED_OUT) {
          localSessionClient.clear()
          sharedPreferencesEditor.clear().apply()
          val params = Arguments.createMap()
          params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.SIGNED_OUT)
          queuedPromise?.resolve(params.copy())
          sendEvent(reactContext, OktaSdkConstant.SIGN_OUT_SUCCESS, params)
          queuedPromise = null
        }
      }

      override fun onCancel() {
        val params = Arguments.createMap()
        params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.CANCELLED)
        sendEvent(reactContext, OktaSdkConstant.ON_CANCELLED, params)
        queuedPromise?.reject(OktaSdkError.CANCELLED.errorCode, OktaSdkError.CANCELLED.errorMessage)
        queuedPromise = null
      }

      override fun onError(msg: String?, error: AuthorizationException?) {
        val params = Arguments.createMap()
        params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.OKTA_OIDC_ERROR.errorCode)
        params.putString(OktaSdkConstant.ERROR_MSG_KEY, msg)
        params.putString(OktaSdkConstant.ERROR_STACK_TRACE_KEY,
          error?.let { getStackTraceString(it) })
        queuedPromise?.reject(OktaSdkError.SIGN_IN_FAILED.errorCode, error?.errorDescription ?: msg)
        sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params)
        queuedPromise = null
      }
    }, activity)
  }

  private fun revokeToken(tokenName: String, promise: Promise) {
    try {
      if (sessionClient == null) {
        promise.reject(
          OktaSdkError.NOT_CONFIGURED.errorCode,
          OktaSdkError.NOT_CONFIGURED.errorMessage
        )
        return
      }
      val tokens = sessionClient!!.tokens
      val token: String?
      token = when (tokenName) {
        TokenTypeHint.ACCESS_TOKEN -> tokens.accessToken
        TokenTypeHint.ID_TOKEN -> tokens.idToken
        TokenTypeHint.REFRESH_TOKEN -> tokens.refreshToken
        else -> {
          promise.reject(
            OktaSdkError.ERROR_TOKEN_TYPE.errorCode,
            OktaSdkError.ERROR_TOKEN_TYPE.errorMessage
          )
          return
        }
      }
      sessionClient!!.revokeToken(token,
        object : RequestCallback<Boolean, AuthorizationException> {
          override fun onSuccess(result: Boolean) {
            promise.resolve(result)
          }

          override fun onError(msg: String, error: AuthorizationException) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, error.localizedMessage, error)
          }
        })
    } catch (e: Exception) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  private fun introspectToken(tokenName: String, promise: Promise) {
    try {
      if (sessionClient == null) {
        promise.reject(
          OktaSdkError.NOT_CONFIGURED.errorCode,
          OktaSdkError.NOT_CONFIGURED.errorMessage
        )
        return
      }
      val tokens = sessionClient!!.tokens
      val token: String?
      if (tokens == null) {
        promise.reject(OktaSdkError.NO_TOKENS.errorCode, OktaSdkError.NO_TOKENS.errorMessage)
        return
      }
      token = when (tokenName) {
        TokenTypeHint.ACCESS_TOKEN -> tokens.accessToken
        TokenTypeHint.ID_TOKEN -> tokens.idToken
        TokenTypeHint.REFRESH_TOKEN -> tokens.refreshToken
        else -> {
          promise.reject(
            OktaSdkError.ERROR_TOKEN_TYPE.errorCode,
            OktaSdkError.ERROR_TOKEN_TYPE.errorMessage
          )
          return
        }
      }
      sessionClient!!.introspectToken(token,
        tokenName, object : RequestCallback<IntrospectInfo, AuthorizationException> {
          override fun onSuccess(result: IntrospectInfo) {
            val params = Arguments.createMap()
            params.putBoolean(OktaSdkConstant.ACTIVE_KEY, result.isActive)
            params.putString(OktaSdkConstant.TOKEN_TYPE_KEY, result.tokenType)
            params.putString(OktaSdkConstant.SCOPE_KEY, result.scope)
            params.putString(OktaSdkConstant.CLIENT_ID_KEY, result.clientId)
            params.putString(OktaSdkConstant.DEVICE_ID_KEY, result.deviceId)
            params.putString(OktaSdkConstant.USERNAME_KEY, result.username)
            params.putInt(OktaSdkConstant.NBF_KEY, result.nbf)
            params.putInt(OktaSdkConstant.EXP_KEY, result.exp)
            params.putInt(OktaSdkConstant.IAT_KEY, result.iat)
            params.putString(OktaSdkConstant.SUB_KEY, result.sub)
            params.putString(OktaSdkConstant.AUD_KEY, result.aud)
            params.putString(OktaSdkConstant.ISS_KEY, result.iss)
            params.putString(OktaSdkConstant.JTI_KEY, result.jti)
            params.putString(OktaSdkConstant.UID_KEY, result.uid)
            promise.resolve(params)
          }

          override fun onError(e: String, error: AuthorizationException) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, error.localizedMessage, error)
          }
        }
      )
    } catch (e: AuthorizationException) {
      promise.reject(OktaSdkError.OKTA_OIDC_ERROR.errorCode, e.localizedMessage, e)
    }
  }

  private fun isIdTokenNotExpired(idToken: String?): Boolean {
    return if (idToken == null) {
      false
    } else try {
      val oktaIdToken = OktaIdToken.parseIdToken(idToken)
      val nowInSeconds = System.currentTimeMillis() / 1000L
      oktaIdToken.claims.exp > nowInSeconds
    } catch (e: IllegalArgumentException) {
      false
    }
  }


  private fun getStackTraceString(e: Exception): String {
    val sw = StringWriter()
    val pw = PrintWriter(sw)
    e.printStackTrace(pw)
    pw.flush()
    return sw.toString()
  }

  private enum class LastRequestType {
    SIGN_IN,
    SIGN_OUT
  }
}
