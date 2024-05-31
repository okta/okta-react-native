import OktaAuth from '@okta/okta-auth-js';
import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import jwt_decode from 'jwt-decode';
import type {
  AuthenticationResponse,
  BrowserOptions,
  ConfigParameters,
  Credentials,
  EvenType,
  RefreshResponse,
  StringAnyMap,
} from './type';
import {
  assertClientId,
  assertIssuer,
  assertRedirectUri,
} from '@okta/configuration-validation';
import type { OktaAuthOptions } from '@okta/okta-auth-js';
import { version, peerDependencies } from '../package.json';

const LINKING_ERROR =
  `The package 'react-native-okta-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const memoryState = {} as Record<string, any>;
const storageProvider = {
  getItem: function (key: string) {
    return memoryState[key];
  },
  setItem: function (key: string, val: any) {
    memoryState[key] = val;
  },
  removeItem: function (key: string) {
    delete memoryState[key];
  },
};
let authClient: OktaAuth | null = null;
class OktaAuthError extends Error {
  private code: string;
  private detail: any;
  constructor(code: string, message: string, detail?: any) {
    super(message);
    this.code = code;
    this.detail = detail;
  }
}

class OktaStatusError extends Error {
  private status: string;
  constructor(message: string, status: string) {
    super(message);
    this.status = status;
  }
}

const OktaReactNativeModule = isTurboModuleEnabled
  ? require('./NativeOktaReactNative').default
  : NativeModules.OktaReactNative;

const OktaReactNative = OktaReactNativeModule
  ? OktaReactNativeModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

function getDomain(url: string) {
  const regex = /^(https?:\/\/[^/]+)/;
  const match = url.match(regex);

  if (match) {
    const baseUrl = match[1];
    return baseUrl;
  } else {
    return 'https://';
  }
}
export function createConfigWithCallbacks(
  clientId: string,
  redirectUri: string,
  endSessionRedirectUri: string,
  discoveryUri: string,
  scopes: string[],
  requireHardwareBackedKeyStore: boolean,
  onSuccess: (succeeded: boolean) => void,
  onError: (errorCode: string, message: string, stackTrace: string) => void,
  issuer?: string,
  androidChromeTabColor?: string,
  httpConnectionTimeout?: number,
  httpReadTimeout?: number,
  browserMatchAll?: boolean,
  oktaAuthConfig?: OktaAuthOptions
) {
  assertIssuer(discoveryUri);
  assertClientId(clientId);
  assertRedirectUri(redirectUri);
  assertRedirectUri(endSessionRedirectUri);

  const origin = getDomain(discoveryUri);

  oktaAuthConfig = {
    ...(oktaAuthConfig ?? {}),
    storageManager: {
      token: {
        storageProvider: storageProvider,
      },
    },
    issuer: issuer || origin,
    clientId,
    redirectUri,
    scopes,
  };

  authClient = new OktaAuth(oktaAuthConfig);

  const reactNativeVersion = peerDependencies['react-native'];
  const userAgentTemplate = `okta-react-native/${version} $UPSTREAM_SDK react-native/${reactNativeVersion} ${Platform.OS}/${Platform.Version}`;

  if (authClient._oktaUserAgent) {
    authClient._oktaUserAgent.addEnvironment(
      userAgentTemplate.replace('$UPSTREAM_SDK ', '')
    );
  }

  httpConnectionTimeout = httpConnectionTimeout || 15;
  httpReadTimeout = httpReadTimeout || 10;

  const timeouts = {
    httpConnectionTimeout,
    httpReadTimeout,
  };

  OktaReactNative.createConfig(
    {
      clientId,
      redirectUri,
      endSessionRedirectUri,
      discoveryUri,
      scopes,
      userAgentTemplate,
      requireHardwareBackedKeyStore,
      timeouts,
      browserMatchAll,
      androidChromeTabColor,
    },
    onSuccess,
    onError
  );
}

export const createConfig = async ({
  issuer,
  clientId,
  redirectUri,
  endSessionRedirectUri,
  discoveryUri,
  scopes,
  requireHardwareBackedKeyStore,
  androidChromeTabColor,
  httpConnectionTimeout,
  httpReadTimeout,
  browserMatchAll = false,
  oktaAuthConfig = {},
}: ConfigParameters) => {
  return await new Promise((resolve, reject) => {
    createConfigWithCallbacks(
      clientId,
      redirectUri,
      endSessionRedirectUri,
      discoveryUri,
      scopes,
      requireHardwareBackedKeyStore,
      (successResponse: boolean) => {
        resolve(successResponse);
      },
      (errorCode: string, localizedMessage: string, stackTrace: string) => {
        reject([errorCode, localizedMessage, stackTrace]);
      },
      issuer,
      androidChromeTabColor,
      httpConnectionTimeout,
      httpReadTimeout,
      browserMatchAll,
      oktaAuthConfig
    );
  });
};

export const getAuthClient = () => {
  if (!authClient) {
    throw new OktaAuthError(
      '-100',
      "OktaOidc client isn't configured, check if you have created a configuration with createConfig"
    );
  }
  return authClient;
};

export const signIn = async (options: Credentials) => {
  // Custom sign in
  if (options && typeof options === 'object') {
    return getAuthClient()
      .signInWithCredentials(options)
      .then((transaction) => {
        const { status, sessionToken } = transaction;
        if (status !== 'SUCCESS') {
          throw new OktaStatusError(
            'Transaction status other than "SUCCESS" has been returned. Check transaction.status and handle accordingly.',
            status
          );
        }

        return authenticate(sessionToken ?? '');
      })
      .then((token) => {
        if (!token) {
          throw new Error('Failed to get accessToken');
        }

        return token;
      })
      .catch((error) => {
        throw new OktaAuthError('-1000', 'Sign in was not authorized', error);
      });
  }
  throw new OktaStatusError('Invalid Credentials options', 'FAILED');
};

export const signInWithBrowser = async (options: BrowserOptions = {}) => {
  if (typeof options.noSSO === 'boolean') {
    //@ts-ignore
    options.noSSO = options.noSSO.toString();
  }

  return OktaReactNative.signIn(options);
};

export const signOut = async (): Promise<{ resolve_type: string }> => {
  return OktaReactNative.signOut();
};

export const authenticate = async (
  sessionToken: string
): Promise<AuthenticationResponse> => {
  return OktaReactNative.authenticate(sessionToken);
};

export const getAccessToken = async (): Promise<{ access_token: string }> => {
  return OktaReactNative.getAccessToken();
};

export const getIdToken = async (): Promise<{ id_token: string }> => {
  return OktaReactNative.getIdToken();
};

export const getUser = async (): Promise<StringAnyMap> => {
  return OktaReactNative.getUser().then((data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        throw new OktaAuthError('-600', 'Okta Oidc error', e);
      }
    }

    return data;
  });
};

export const getUserFromIdToken = async (): Promise<StringAnyMap> => {
  let idTokenResponse = await getIdToken();
  return jwt_decode(idTokenResponse.id_token);
};

export const isAuthenticated = async (): Promise<{
  authenticated: boolean;
}> => {
  return OktaReactNative.isAuthenticated();
};
``;

export const revokeAccessToken = async (): Promise<boolean> => {
  return OktaReactNative.revokeAccessToken();
};

export const revokeIdToken = async (): Promise<boolean> => {
  return OktaReactNative.revokeIdToken();
};

export const revokeRefreshToken = async (): Promise<boolean> => {
  return OktaReactNative.revokeRefreshToken();
};

export const introspectAccessToken = async (): Promise<StringAnyMap> => {
  return OktaReactNative.introspectAccessToken();
};

export const introspectIdToken = async (): Promise<StringAnyMap> => {
  return OktaReactNative.introspectIdToken();
};

export const introspectRefreshToken = async (): Promise<StringAnyMap> => {
  return OktaReactNative.introspectRefreshToken();
};

export const refreshTokens = async (): Promise<RefreshResponse> => {
  return OktaReactNative.refreshTokens();
};

export const clearTokens = async (): Promise<boolean> => {
  return OktaReactNative.clearTokens();
};

const EventEmitter = new NativeEventEmitter(OktaReactNative);

export type CallbackEvent = {
  signInSuccess: (event: {
    resolve_type: string;
    access_token: string;
  }) => void;
  onError: (event: { error_code: string; error_message?: string }) => void;
  signOutSuccess: (event: { resolve_type: string }) => void;
  onCancelled: (event: { resolve_type: string }) => void;
};

export const addListener = <T extends EvenType>(
  eventName: T,
  callback: CallbackEvent[T]
) => {
  return EventEmitter.addListener(eventName, callback);
};
