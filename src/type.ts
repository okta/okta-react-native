import type { OktaAuthOptions } from '@okta/okta-auth-js';

export interface ConfigParameters {
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
  browserMatchAll?: boolean;
  oktaAuthConfig?: OktaAuthOptions;
}

export interface AuthenticationResponse {
  resolve_type: string;
  access_token: string;
}

export interface RefreshResponse {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface BrowserOptions {
  idp?: string;
  noSSO?: boolean;
  login_hint?: string;
  prompt?: string;
}
export interface StringAnyMap {
  [index: string]: string | number | boolean | StringAnyMap;
}
export type EvenType =
  | 'signInSuccess'
  | 'onError'
  | 'signOutSuccess'
  | 'onCancelled';
