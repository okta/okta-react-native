export declare function createConfig(
  config: Okta.ConfigParameters
): Promise<boolean>;

export declare function getAuthClient(): Okta.StringDictionary;
export declare function signIn(credentials?: Okta.Credentials): Promise<string>;
export declare function signInWithBrowser(options?: {
  idp: string;
}): Promise<Okta.StringDictionary>;
export declare function signOut(): Promise<Okta.StringDictionary>;

export declare function authenticate(
  sessionToken: string
): Promise<Okta.StringDictionary>;

export declare function getAccessToken(): Promise<Okta.StringDictionary>;
export declare function getIdToken(): Promise<Okta.StringDictionary>;
export declare function getUser(): Promise<Okta.StringDictionary>;
export declare function getUserFromIdToken(): Promise<Okta.StringDictionary>;
export declare function isAuthenticated(): Promise<Okta.StringDictionary>;
// introspect
export declare function revokeAccessToken(): Promise<boolean>;
export declare function revokeIdToken(): Promise<boolean>;
export declare function revokeRefreshToken(): Promise<boolean>;
// revoke
export declare function introspectAccessToken(): Promise<Okta.StringDictionary>;
export declare function introspectIdToken(): Promise<Okta.StringDictionary>;
export declare function introspectRefreshToken(): Promise<Okta.StringDictionary>;

export declare function refreshTokens(): Promise<Okta.StringDictionary>;
export declare function clearTokens(): Promise<boolean>;

import { NativeEventEmitter } from 'react-native';

export const EventEmitter: NativeEventEmitter;

export declare namespace Okta {
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
  }

  export interface Credentials {
    username: string;
    password: string;
  }

  export interface StringDictionary {
    [index: string]: string;
  }
}
