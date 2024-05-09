package com.oktareactnative

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

abstract class OktaReactNativeSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun createConfig(
    options: ReadableMap,
    successCallback: Callback,
    errorCallback: Callback,

  )

  abstract fun signOut(promise: Promise)
  abstract fun signIn(options: ReadableMap, promise: Promise)
  abstract fun authenticate(sessionToken: String, promise: Promise)
  abstract fun getAccessToken(promise: Promise)
  abstract fun getIdToken(promise: Promise)
  abstract fun getUser(promise: Promise)
  abstract fun isAuthenticated(promise: Promise)
  abstract fun revokeAccessToken(promise: Promise)
  abstract fun revokeIdToken(promise: Promise)
  abstract fun revokeRefreshToken(promise: Promise)
  abstract fun introspectAccessToken(promise: Promise)
  abstract fun introspectIdToken(promise: Promise)
  abstract fun introspectRefreshToken(promise: Promise)
  abstract fun refreshTokens(promise: Promise)
  abstract fun clearTokens(promise: Promise)
  abstract fun addListener(eventName: String)
  abstract fun removeListeners(count: Int)
}
