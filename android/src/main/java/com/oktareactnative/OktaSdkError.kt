package com.oktareactnative


enum class OktaSdkError(val errorCode: String, val errorMessage: String) {
  NOT_CONFIGURED(
    "-100",
    "OktaOidc client isn't configured, check if you have created a configuration with createConfig"
  ),
  NO_VIEW("-200", "No current view exists"),
  NO_ID_TOKEN("-500", "Id token does not exist"),
  OKTA_OIDC_ERROR("-600", "Okta Oidc error"),
  ERROR_TOKEN_TYPE("-700", "Token type not found"),
  NO_ACCESS_TOKEN("-900", "No access token found"),
  SIGN_IN_FAILED("-1000", "Sign in was not authorized"),
  NO_TOKENS("-1100", "Tokens not found"),
  CANCELLED("-1200", "User cancelled a session")

}

