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


/* eslint-disable node/no-missing-import, camelcase */
import OktaSDK, { Okta } from './index';
import { expectType } from 'tsd';
import { OktaAuth  } from '@okta/okta-auth-js';

expectType<Promise<boolean>>(OktaSDK.createConfig({
  issuer: '{issuer}',
  clientId: '{clientID}',
  redirectUri: '{redirectUri}',
  endSessionRedirectUri: '{endSessionRedirectUri}',
  discoveryUri: '{discoveryUri}',
  scopes: ['scope1', 'scope2'],
  keychainService: 'Test';
  keychainAccessGroup: 'com.example.SharedItems';
  requireHardwareBackedKeyStore: false,
  androidChromeTabColor: '#00000',
  httpConnectionTimeout: 15,
  httpReadTimeout: 10,
  browserMatchAll: false,
  oktaAuthConfig: {}
}));

expectType<OktaAuth>(OktaSDK.getAuthClient());

expectType<Promise<Okta.AuthenticationResponse>>(OktaSDK.signIn());

expectType<Promise<Okta.AuthenticationResponse>>(OktaSDK.signIn({ username: '{username}', password: '{password}' }));

expectType<Promise<Okta.AuthenticationResponse>>(OktaSDK.signInWithBrowser());

expectType<Promise<Okta.AuthenticationResponse>>(OktaSDK.signInWithBrowser({ idp: '{idp}' }));

expectType<Promise<Okta.AuthenticationResponse>>(OktaSDK.signInWithBrowser({ noSSO: true }));

expectType<Promise<Okta.AuthenticationResponse>>(OktaSDK.authenticate({ sessionToken: 'sessionToken' }));

expectType<Promise<{ resolve_type: string; }>>(OktaSDK.signOut());

expectType<Promise<{ id_token: string; }>>(OktaSDK.getIdToken());

expectType<Promise<{ access_token: string; }>>(OktaSDK.getAccessToken());

expectType<Promise<Okta.StringAnyMap>>(OktaSDK.getUser());

expectType<Promise<Okta.StringAnyMap>>(OktaSDK.getUserFromIdToken());

expectType<Promise<{ authenticated: boolean; }>>(OktaSDK.isAuthenticated());

expectType<Promise<boolean>>(OktaSDK.revokeAccessToken());

expectType<Promise<boolean>>(OktaSDK.revokeIdToken());

expectType<Promise<boolean>>(OktaSDK.revokeRefreshToken());

expectType<Promise<Okta.StringAnyMap>>(OktaSDK.introspectAccessToken());

expectType<Promise<Okta.StringAnyMap>>(OktaSDK.introspectIdToken());

expectType<Promise<Okta.StringAnyMap>>(OktaSDK.introspectRefreshToken());

expectType<Promise<Okta.RefreshResponse>>(OktaSDK.refreshTokens());

expectType<Promise<boolean>>(OktaSDK.clearTokens());
