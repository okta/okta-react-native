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

// TypeScript Version: 4.1

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */

export function createConfig(config: Okta.ConfigParameters): Promise<boolean>;

export function getAuthClient(): Okta.StringAnyMap;

export function signIn(
  credentials?: Okta.Credentials
): Promise<Okta.AuthenticationResponse>;

export function signInWithBrowser(options?: {
  idp: string;
}): Promise<Okta.AuthenticationResponse>;

export function authenticate(
  sessionToken: string
): Promise<Okta.AuthenticationResponse>;

export function signOut(): Promise<{ resolve_type: string }>;

export function getAccessToken(): Promise<{ access_token: string }>;
export function getIdToken(): Promise<{ id_token: string }>;
export function getUser(): Promise<Okta.StringAnyMap>;
export function getUserFromIdToken(): Promise<Okta.StringAnyMap>;
export function isAuthenticated(): Promise<{ authenticated: boolean }>;

export function revokeAccessToken(): Promise<boolean>;
export function revokeIdToken(): Promise<boolean>;
export function revokeRefreshToken(): Promise<boolean>;

export function introspectAccessToken(): Promise<Okta.StringAnyMap>;
export function introspectIdToken(): Promise<Okta.StringAnyMap>;
export function introspectRefreshToken(): Promise<Okta.StringAnyMap>;

export function refreshTokens(): Promise<Okta.RefreshResponse>;
export function clearTokens(): Promise<boolean>;

import { NativeEventEmitter } from 'react-native';

export const EventEmitter: NativeEventEmitter;

export namespace Okta {
  interface ConfigParameters {
    issuer?: string;
    clientId: string;
    redirectUri: string;
    endSessionRedirectUri: string;
    discoveryUri: string;
    scopes: string[];
    requireHardwareBackedKeyStore: boolean;
    androidChromeTabColor?: string;
    httpConnectionTimeout?: number;
    httpReadTimeout?: number;
  }

  interface AuthenticationResponse {
    resolve_type: string;
    access_token: string;
  }

  interface RefreshResponse {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
  }

  interface Credentials {
    username: string;
    password: string;
  }

  interface StringAnyMap {
    [index: string]: string | number | boolean | StringAnyMap;
  }
}
