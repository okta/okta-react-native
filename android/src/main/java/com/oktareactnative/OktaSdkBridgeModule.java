/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

package com.oktareactnative;

import static com.okta.oidc.OktaResultFragment.REQUEST_CODE_SIGN_IN;
import static com.okta.oidc.OktaResultFragment.REQUEST_CODE_SIGN_OUT;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.okta.oidc.AuthenticationPayload;
import com.okta.oidc.AuthorizationStatus;
import com.okta.oidc.OIDCConfig;
import com.okta.oidc.Okta;
import com.okta.oidc.OktaBuilder;
import com.okta.oidc.OktaIdToken;
import com.okta.oidc.RequestCallback;
import com.okta.oidc.ResultCallback;
import com.okta.oidc.Tokens;
import com.okta.oidc.results.Result;
import com.okta.oidc.clients.sessions.SessionClient;
import com.okta.oidc.clients.web.WebAuthClient;
import com.okta.oidc.clients.AuthClient;
import com.okta.oidc.net.params.TokenTypeHint;
import com.okta.oidc.net.response.IntrospectInfo;
import com.okta.oidc.net.response.UserInfo;
import com.okta.oidc.storage.SharedPreferenceStorage;
import com.okta.oidc.util.AuthorizationException;

public class OktaSdkBridgeModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final ReactApplicationContext reactContext;
    private OIDCConfig config;
    private WebAuthClient webClient;
    private AuthClient authClient;
    private Promise queuedPromise;

    public OktaSdkBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @Override
    @NonNull
    public String getName() {
        return "OktaSdkBridge";
    }

    @ReactMethod
    public void createConfig(String clientId,
            String redirectUri,
            String endSessionRedirectUri,
            String discoveryUri,
            ReadableArray scopes,
            String userAgentTemplate,
            Boolean requireHardwareBackedKeyStore,
            String androidChromeTabColor,
            ReadableMap timeouts,
            Boolean browserMatchAll,
            Promise promise
    ) {

        try {
            int connectTimeout = 1000 * resolveTimeout(timeouts, "httpConnectionTimeout", 15);
            int readTimeout = 1000 * resolveTimeout(timeouts, "httpReadTimeout", 10);

            String[] scopeArray = new String[scopes.size()];

            for (int i = 0; i < scopes.size(); i++) {
                scopeArray[i] = scopes.getString(i);
            }

            this.config = new OIDCConfig.Builder()
                    .clientId(clientId)
                    .redirectUri(redirectUri)
                    .endSessionRedirectUri(endSessionRedirectUri)
                    .scopes(scopeArray)
                    .discoveryUri(discoveryUri)
                    .create();

            Okta.WebAuthBuilder webAuthBuilder = new Okta.WebAuthBuilder();
            configureBuilder(webAuthBuilder, userAgentTemplate, requireHardwareBackedKeyStore, connectTimeout, readTimeout);

            if (androidChromeTabColor != null) {
                try {
                    webAuthBuilder.withTabColor(Color.parseColor(androidChromeTabColor));
                } catch (IllegalArgumentException e) {
                    // The color wasn't in the right format.
                    promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
                }
            }

            if (browserMatchAll != null && browserMatchAll) {
                webAuthBuilder.browserMatchAll(true);
            }

            this.webClient = webAuthBuilder.create();

            Okta.AuthBuilder authClientBuilder = new Okta.AuthBuilder();
            configureBuilder(authClientBuilder, userAgentTemplate, requireHardwareBackedKeyStore, connectTimeout, readTimeout);
            this.authClient = authClientBuilder.create();

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    private int resolveTimeout(ReadableMap timeouts, String key, int defaultValue) {
        if (!timeouts.hasKey(key)) {
            return defaultValue;
        } else {
            int timeout = timeouts.getInt(key);

            if (timeout < 0) {
                return defaultValue;
            }

            return timeout;
        }
    }

    private <T extends OktaBuilder<?, T>> void configureBuilder(
            T builder,
            String userAgentTemplate,
            boolean requireHardwareBackedKeyStore,
            int connectTimeoutMs,
            int readTimeoutMs
    ) {
        builder.withConfig(config)
                .withOktaHttpClient(new HttpClientImpl(userAgentTemplate, connectTimeoutMs, readTimeoutMs))
                .withContext(reactContext)
                .withStorage(new SharedPreferenceStorage(reactContext))
                .setRequireHardwareBackedKeyStore(requireHardwareBackedKeyStore);
    }

    @ReactMethod
    public void signIn(
        ReadableMap options,
        Promise promise
    ) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            final WritableMap params = Arguments.createMap();
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NO_VIEW.getErrorCode());
            params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NO_VIEW.getErrorMessage());
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
            promise.reject(OktaSdkError.NO_VIEW.getErrorCode(), OktaSdkError.NO_VIEW.getErrorMessage());
            return;
        }

        if (webClient == null) {
            final WritableMap params = Arguments.createMap();
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NOT_CONFIGURED.getErrorCode());
            params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
            promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            return;
        }

        AuthenticationPayload.Builder payloadBuilder = new AuthenticationPayload.Builder();
        if (options.hasKey("idp")) {
            payloadBuilder.setIdp(options.getString("idp"));
        }
        queuedPromise = promise;
        webClient.signIn(currentActivity, payloadBuilder.build());
    }

    @ReactMethod
    public void authenticate(String sessionToken, final Promise promise) {
        if (authClient == null) {
            final WritableMap params = Arguments.createMap();
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NOT_CONFIGURED.getErrorCode());
            params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
            promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            return;
        }

        authClient.signIn(sessionToken, null, new RequestCallback<Result, AuthorizationException>() {
            @Override
            public void onSuccess(@NonNull Result result) {
                if (result.isSuccess()) {
                    try {
                        SessionClient sessionClient = authClient.getSessionClient();
                        Tokens tokens = sessionClient.getTokens();
                        String token = tokens.getAccessToken();

                        WritableMap params = Arguments.createMap();
                        params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.AUTHORIZED);
                        params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, token);
                        sendEvent(reactContext, OktaSdkConstant.SIGN_IN_SUCCESS, params);

                        params = Arguments.createMap();
                        params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.AUTHORIZED);
                        params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, token);
                        promise.resolve(params);
                    } catch (AuthorizationException e) {
                        WritableMap params = Arguments.createMap();
                        params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.SIGN_IN_FAILED.getErrorCode());
                        params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.SIGN_IN_FAILED.getErrorMessage());
                        sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
                        promise.reject(OktaSdkError.SIGN_IN_FAILED.getErrorCode(), OktaSdkError.SIGN_IN_FAILED.getErrorMessage());
                    }
                } else {
                    WritableMap params = Arguments.createMap();
                    params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.SIGN_IN_FAILED.getErrorCode());
                    params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.SIGN_IN_FAILED.getErrorMessage());
                    sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
                    promise.reject(OktaSdkError.SIGN_IN_FAILED.getErrorCode(), OktaSdkError.SIGN_IN_FAILED.getErrorMessage());
                }
            }

            @Override
            public void onError(String error, AuthorizationException exception) {
                WritableMap params = Arguments.createMap();
                params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.OKTA_OIDC_ERROR.getErrorCode());
                params.putString(OktaSdkConstant.ERROR_MSG_KEY, error);
                sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
                promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), OktaSdkError.OKTA_OIDC_ERROR.getErrorMessage());
            }
        });
    }

    @ReactMethod
    public void getAccessToken(final Promise promise) {
        try {
            if (webClient == null) {
                promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
                return;
            }

            final WritableMap params = Arguments.createMap();
            final SessionClient sessionClient = webClient.getSessionClient();
            final Tokens tokens = sessionClient.getTokens();

            final String accessToken = tokens == null || tokens.isAccessTokenExpired() ? null : tokens.getAccessToken();
            if (accessToken != null) {
                params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, accessToken);
                promise.resolve(params);
            } else {
                promise.reject(OktaSdkError.NO_ACCESS_TOKEN.getErrorCode(), OktaSdkError.NO_ACCESS_TOKEN.getErrorMessage());
            }
        } catch (Exception e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    @ReactMethod
    public void getIdToken(Promise promise) {
        try {
            if (webClient == null) {
                promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
                return;
            }

            final WritableMap params = Arguments.createMap();
            SessionClient sessionClient = webClient.getSessionClient();
            Tokens tokens = sessionClient.getTokens();
            String idToken = tokens.getIdToken();
            if (idToken != null) {
                params.putString(OktaSdkConstant.ID_TOKEN_KEY, idToken);
                promise.resolve(params);
            } else {
                promise.reject(OktaSdkError.NO_ID_TOKEN.getErrorCode(), OktaSdkError.NO_ID_TOKEN.getErrorMessage());
            }
        } catch (Exception e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    @ReactMethod
    public void getUser(final Promise promise) {
        if (webClient == null) {
            promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            return;
        }

        SessionClient sessionClient = webClient.getSessionClient();
        sessionClient.getUserProfile(new RequestCallback<UserInfo, AuthorizationException>() {
            @Override
            public void onSuccess(@NonNull UserInfo result) {
                promise.resolve(result.toString());
            }

            @Override
            public void onError(String msg, AuthorizationException error) {
                promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), error.getLocalizedMessage(), error);
            }
        });
    }

    @ReactMethod
    public void isAuthenticated(Promise promise) {
        try {
            if (webClient == null) {
                promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
                return;
            }

            final WritableMap params = Arguments.createMap();
            SessionClient sessionClient = webClient.getSessionClient();
            Tokens tokens = sessionClient.getTokens();
            if (tokens == null) {
                params.putBoolean(OktaSdkConstant.AUTHENTICATED_KEY, false);
                promise.resolve(params);
                return;
            }
            boolean isAccessTokenAvailable = tokens.getAccessToken() != null && !tokens.isAccessTokenExpired();
            boolean isAuthenticated = isAccessTokenAvailable && isIdTokenNotExpired(tokens.getIdToken());
            params.putBoolean(OktaSdkConstant.AUTHENTICATED_KEY, isAuthenticated);
            promise.resolve(params);
        } catch (Exception e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    @ReactMethod
    public void signOut(
        Promise promise
    ) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            final WritableMap params = Arguments.createMap();
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NO_VIEW.getErrorCode());
            params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NO_VIEW.getErrorMessage());
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
            promise.reject(OktaSdkError.NO_VIEW.getErrorCode(), OktaSdkError.NO_VIEW.getErrorMessage());
            return;
        }

        if (webClient == null) {
            final WritableMap params = Arguments.createMap();
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NOT_CONFIGURED.getErrorCode());
            params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
            promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
            return;
        }

        queuedPromise = promise;
        webClient.signOutOfOkta(currentActivity);
    }

    @ReactMethod
    public void revokeAccessToken(Promise promise) {
        revokeToken(TokenTypeHint.ACCESS_TOKEN, promise);
    }

    @ReactMethod
    public void revokeIdToken(Promise promise) {
        revokeToken(TokenTypeHint.ID_TOKEN, promise);
    }

    @ReactMethod
    public void revokeRefreshToken(Promise promise) {
        revokeToken(TokenTypeHint.REFRESH_TOKEN, promise);
    }

    @ReactMethod
    public void introspectAccessToken(Promise promise) {
        introspectToken(TokenTypeHint.ACCESS_TOKEN, promise);
    }

    @ReactMethod
    public void introspectIdToken(Promise promise) {
        introspectToken(TokenTypeHint.ID_TOKEN, promise);
    }

    @ReactMethod
    public void introspectRefreshToken(Promise promise) {
        introspectToken(TokenTypeHint.REFRESH_TOKEN, promise);
    }

    @ReactMethod
    public void refreshTokens(final Promise promise) {
        try {

            if (webClient == null) {
                promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
                return;
            }

            webClient.getSessionClient().refreshToken(new RequestCallback<Tokens, AuthorizationException>() {
                @Override
                public void onSuccess(@NonNull Tokens result) {
                    WritableMap params = Arguments.createMap();
                    params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, result.getAccessToken());
                    params.putString(OktaSdkConstant.ID_TOKEN_KEY, result.getIdToken());
                    params.putString(OktaSdkConstant.REFRESH_TOKEN_KEY, result.getRefreshToken());
                    promise.resolve(params);
                }

                @Override
                public void onError(String e, AuthorizationException error) {
                    promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), error.getLocalizedMessage(), error);
                }
            });
        } catch (Error e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    @ReactMethod
    public void clearTokens(final Promise promise) {
        try {
            if (webClient != null) {
                webClient.getSessionClient().clear();
            }

            if (authClient != null) {
                authClient.getSessionClient().clear();
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (activity == null) {
            final WritableMap params = Arguments.createMap();
            params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.NO_VIEW.getErrorCode());
            params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.NO_VIEW.getErrorMessage());
            sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
            return;
        }
        if (webClient != null) {
            int rc = getRecalculatedRequestCodeForActivityResult(requestCode, resultCode, data);
            webClient.handleActivityResult(rc, resultCode, data);
            registerCallback(activity);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    /**
     * ================= Private Methods =================
     **/

    private void sendEvent(ReactContext reactContext,
            String eventName,
            @Nullable WritableMap params) {
        reactContext
                .getJSModule(RCTNativeAppEventEmitter.class)
                .emit(eventName, params);
    }

    private void registerCallback(Activity activity) {
        final SessionClient sessionClient = webClient.getSessionClient();

        webClient.registerCallback(new ResultCallback<AuthorizationStatus, AuthorizationException>() {
            @Override
            public void onSuccess(@NonNull AuthorizationStatus status) {
                final Promise promise = queuedPromise;
                if (status == AuthorizationStatus.AUTHORIZED) {
                    try {
                        WritableMap params = Arguments.createMap();
                        Tokens tokens = sessionClient.getTokens();
                        params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.AUTHORIZED);
                        params.putString(OktaSdkConstant.ACCESS_TOKEN_KEY, tokens.getAccessToken());
                        if (promise != null) {
                            promise.resolve(params.copy());
                        }
                        sendEvent(reactContext, OktaSdkConstant.SIGN_IN_SUCCESS, params);
                        queuedPromise = null;
                    } catch (AuthorizationException e) {
                        WritableMap params = Arguments.createMap();
                        params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.SIGN_IN_FAILED.getErrorCode());
                        params.putString(OktaSdkConstant.ERROR_MSG_KEY, OktaSdkError.SIGN_IN_FAILED.getErrorMessage());
                        if (promise != null) {
                            promise.reject(e);
                        }
                        sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
                        queuedPromise = null;
                    }
                } else if (status == AuthorizationStatus.SIGNED_OUT) {
                    sessionClient.clear();
                    WritableMap params = Arguments.createMap();
                    params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.SIGNED_OUT);
                    if (promise != null) {
                        promise.resolve(params.copy());
                    }
                    sendEvent(reactContext, OktaSdkConstant.SIGN_OUT_SUCCESS, params);
                    queuedPromise = null;
                }
            }

            @Override
            public void onCancel() {
                WritableMap params = Arguments.createMap();
                params.putString(OktaSdkConstant.RESOLVE_TYPE_KEY, OktaSdkConstant.CANCELLED);
                sendEvent(reactContext, OktaSdkConstant.ON_CANCELLED, params);
                final Promise promise = queuedPromise;
                promise.reject(OktaSdkError.CANCELLED.getErrorCode(), OktaSdkError.CANCELLED.getErrorMessage());
                queuedPromise = null;
            }

            @Override
            public void onError(@NonNull String msg, AuthorizationException error) {
                WritableMap params = Arguments.createMap();
                params.putString(OktaSdkConstant.ERROR_CODE_KEY, OktaSdkError.OKTA_OIDC_ERROR.getErrorCode());
                params.putString(OktaSdkConstant.ERROR_MSG_KEY, msg);
                sendEvent(reactContext, OktaSdkConstant.ON_ERROR, params);
                final Promise promise = queuedPromise;
                promise.reject(OktaSdkError.SIGN_IN_FAILED.getErrorCode(), params);
                queuedPromise = null;
            }
        }, activity);
    }

    private void revokeToken(String tokenName, final Promise promise) {
        try {
            if (webClient == null) {
                promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
                return;
            }

            final SessionClient sessionClient = webClient.getSessionClient();
            Tokens tokens = sessionClient.getTokens();
            String token;

            switch (tokenName) {
                case TokenTypeHint.ACCESS_TOKEN:
                    token = tokens.getAccessToken();
                    break;
                case TokenTypeHint.ID_TOKEN:
                    token = tokens.getIdToken();
                    break;
                case TokenTypeHint.REFRESH_TOKEN:
                    token = tokens.getRefreshToken();
                    break;
                default:
                    promise.reject(OktaSdkError.ERROR_TOKEN_TYPE.getErrorCode(), OktaSdkError.ERROR_TOKEN_TYPE.getErrorMessage());
                    return;
            }

            sessionClient.revokeToken(token,
                    new RequestCallback<Boolean, AuthorizationException>() {
                        @Override
                        public void onSuccess(@NonNull Boolean result) {
                            promise.resolve(result);
                        }

                        @Override
                        public void onError(String msg, AuthorizationException error) {
                            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), error.getLocalizedMessage(), error);
                        }
                    });
        } catch (Exception e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    private void introspectToken(String tokenName, final Promise promise) {
        try {
            if (webClient == null) {
                promise.reject(OktaSdkError.NOT_CONFIGURED.getErrorCode(), OktaSdkError.NOT_CONFIGURED.getErrorMessage());
                return;
            }

            final SessionClient sessionClient = webClient.getSessionClient();
            Tokens tokens = sessionClient.getTokens();
            String token;

            if (tokens == null) {
                promise.reject(OktaSdkError.NO_TOKENS.getErrorCode(), OktaSdkError.NO_TOKENS.getErrorMessage());
                return;
            }

            switch (tokenName) {
                case TokenTypeHint.ACCESS_TOKEN:
                    token = tokens.getAccessToken();
                    break;
                case TokenTypeHint.ID_TOKEN:
                    token = tokens.getIdToken();
                    break;
                case TokenTypeHint.REFRESH_TOKEN:
                    token = tokens.getRefreshToken();
                    break;
                default:
                    promise.reject(OktaSdkError.ERROR_TOKEN_TYPE.getErrorCode(), OktaSdkError.ERROR_TOKEN_TYPE.getErrorMessage());
                    return;
            }

            webClient.getSessionClient().introspectToken(token,
                    tokenName, new RequestCallback<IntrospectInfo, AuthorizationException>() {
                        @Override
                        public void onSuccess(@NonNull IntrospectInfo result) {
                            WritableMap params = Arguments.createMap();
                            params.putBoolean(OktaSdkConstant.ACTIVE_KEY, result.isActive());
                            params.putString(OktaSdkConstant.TOKEN_TYPE_KEY, result.getTokenType());
                            params.putString(OktaSdkConstant.SCOPE_KEY, result.getScope());
                            params.putString(OktaSdkConstant.CLIENT_ID_KEY, result.getClientId());
                            params.putString(OktaSdkConstant.DEVICE_ID_KEY, result.getDeviceId());
                            params.putString(OktaSdkConstant.USERNAME_KEY, result.getUsername());
                            params.putInt(OktaSdkConstant.NBF_KEY, result.getNbf());
                            params.putInt(OktaSdkConstant.EXP_KEY, result.getExp());
                            params.putInt(OktaSdkConstant.IAT_KEY, result.getIat());
                            params.putString(OktaSdkConstant.SUB_KEY, result.getSub());
                            params.putString(OktaSdkConstant.AUD_KEY, result.getAud());
                            params.putString(OktaSdkConstant.ISS_KEY, result.getIss());
                            params.putString(OktaSdkConstant.JTI_KEY, result.getJti());
                            params.putString(OktaSdkConstant.UID_KEY, result.getUid());
                            promise.resolve(params);
                        }

                        @Override
                        public void onError(String e, AuthorizationException error) {
                            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), error.getLocalizedMessage(), error);
                        }
                    }
            );
        } catch (AuthorizationException e) {
            promise.reject(OktaSdkError.OKTA_OIDC_ERROR.getErrorCode(), e.getLocalizedMessage(), e);
        }
    }

    private boolean isIdTokenNotExpired(@Nullable String idToken) {
        if (idToken == null) {
            return false;
        }
        try {
            OktaIdToken oktaIdToken = OktaIdToken.parseIdToken(idToken);
            long nowInSeconds = System.currentTimeMillis() / 1000L;
            return oktaIdToken.getClaims().exp > nowInSeconds;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private int getRecalculatedRequestCodeForActivityResult(
            final int initialRequestCode,
            final int resultCode,
            @Nullable Intent data
    ) {
        if (resultCode == Activity.RESULT_OK) {
            final String callbackUri = data != null ? data.getDataString() : "";
            if (callbackUri == null) return initialRequestCode;
            if (callbackUri.startsWith(this.config.getRedirectUri().toString())) {
                return REQUEST_CODE_SIGN_IN;
            } else if (callbackUri.startsWith(this.config.getEndSessionRedirectUri().toString())) {
                return REQUEST_CODE_SIGN_OUT;
            }
        } else if (resultCode == Activity.RESULT_CANCELED){
            return REQUEST_CODE_SIGN_IN;
        }
        return initialRequestCode;
    }
}
