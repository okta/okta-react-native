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

/* eslint-disable node/no-missing-import */

import OktaSDK from 'OktaSDK';

// $ExpectType Promise<boolean>
OktaSDK.createConfig({
  issuer: '{issuer}',
  clientId: '{clientID}',
  redirectUri: '{redirectUri}',
  endSessionRedirectUri: '{endSessionRedirectUri}',
  discoveryUri: '{discoveryUri}',
  scopes: ['scope1', 'scope2'],
  requireHardwareBackedKeyStore: false,
  androidChromeTabColor: '#00000',
  httpConnectionTimeout: 15,
  httpReadTimeout: 10,
  browserMatchAll: false,
});

// $ExpectType StringAnyMap
OktaSDK.getAuthClient();

// $ExpectType Promise<AuthenticationResponse>
OktaSDK.signIn();

// $ExpectType Promise<AuthenticationResponse>
OktaSDK.signIn({ username: '{username}', password: '{password}' });

// $ExpectType Promise<AuthenticationResponse>
OktaSDK.signInWithBrowser();

// $ExpectType Promise<AuthenticationResponse>
OktaSDK.signInWithBrowser({ idp: '{idp}' });

// $ExpectType Promise<AuthenticationResponse>
OktaSDK.signInWithBrowser({ noSSO: true });

// $ExpectType Promise<AuthenticationResponse>
OktaSDK.authenticate('{sessionToken}');

// $ExpectType Promise<{ resolve_type: string; }>
OktaSDK.signOut();

// $ExpectType Promise<{ id_token: string; }>
OktaSDK.getIdToken();

// $ExpectType Promise<{ access_token: string; }>
OktaSDK.getAccessToken();

// $ExpectType Promise<StringAnyMap>
OktaSDK.getUser();

// $ExpectType Promise<StringAnyMap>
OktaSDK.getUserFromIdToken();

// $ExpectType Promise<{ authenticated: boolean; }>
OktaSDK.isAuthenticated();

// $ExpectType Promise<boolean>
OktaSDK.revokeAccessToken();

// $ExpectType Promise<boolean>
OktaSDK.revokeIdToken();

// $ExpectType Promise<boolean>
OktaSDK.revokeRefreshToken();

// $ExpectType Promise<StringAnyMap>
OktaSDK.introspectAccessToken();

// $ExpectType Promise<StringAnyMap>
OktaSDK.introspectIdToken();

// $ExpectType Promise<StringAnyMap>
OktaSDK.introspectRefreshToken();

// $ExpectType Promise<RefreshResponse>
OktaSDK.refreshTokens();

// $ExpectType Promise<boolean>
OktaSDK.clearTokens();
