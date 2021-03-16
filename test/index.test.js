/*
 * Copyright (c) 2019-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

/* eslint-disable camelcase */

const {
  createConfig,
  signIn,
  signInWithBrowser,
  signOut,
  authenticate,
  getAccessToken,
  getIdToken,
  getUser,
  getAuthClient,
  getUserFromIdToken,
  isAuthenticated,
  revokeAccessToken,
  revokeIdToken,
  revokeRefreshToken,
  introspectAccessToken,
  introspectIdToken,
  introspectRefreshToken,
  refreshTokens,
  clearTokens,
} = jest.requireActual('../');

import { Platform } from 'react-native';
import { version } from '../package.json';
import { OktaAuth } from '@okta/okta-auth-js';

let mockSignInOktaAuth = jest.fn();

jest.mock('@okta/okta-auth-js', () => { 
  return {
    OktaAuth: jest.fn().mockImplementation(() => {
      return {signIn: mockSignInOktaAuth};
    })
  };
});

jest.mock('react-native', () => {
  return ({
    NativeModules: {
      OktaSdkBridge: {
        createConfig: jest.fn(),
        signIn: jest.fn(),
        authenticate: jest.fn(),
        signOut: jest.fn(),
        getAccessToken: jest.fn(),
        getIdToken: jest.fn(),
        getUser: jest.fn(),
        isAuthenticated: jest.fn(),
        revokeAccessToken: jest.fn(),
        revokeIdToken: jest.fn(),
        revokeRefreshToken: jest.fn(),
        introspectAccessToken: jest.fn(),
        introspectIdToken: jest.fn(),
        introspectRefreshToken: jest.fn(),
        refreshTokens: jest.fn(),
        clearTokens: jest.fn(),
      },
    },
    Platform: {
      OS: 'ios',
      select: jest.fn()
    },
    NativeEventEmitter: jest.fn(),
  });
});

describe('OktaReactNative', () => {

  describe('createConfigTest', () => {
    let mockCreateConfig;

    const config = {
      clientId: 'dummy_client_id',
      redirectUri: 'dummy://redirect', 
      endSessionRedirectUri: 'dummy://endSessionRedirect', 
      discoveryUri: 'https://dummy_issuer',
      scopes: ['scope1'],
      requireHardwareBackedKeyStore: true
    };

    beforeEach(() => {
      mockCreateConfig = require('react-native').NativeModules.OktaSdkBridge.createConfig;
      mockCreateConfig.mockReset();
      OktaAuth.mockClear();
    });

    it('authClient returns the error', () => {
      expect(() => { getAuthClient(); })
        .toThrowError({ 
          code: '-100', 
          message: 'OktaOidc client isn\'t configured, check if you have created a configuration with createConfig'
        });
    });
    
    it('passes in correct parameters on ios device', () => {
      Platform.OS = 'ios';
      Platform.Version = '1.0.0';
      const processedScope = config.scopes.join(' ');
      createConfig(config);
      expect(mockCreateConfig).toHaveBeenCalledTimes(1);
      expect(mockCreateConfig).toHaveBeenCalledWith(
        config.clientId,
        config.redirectUri,
        config.endSessionRedirectUri,
        config.discoveryUri,
        processedScope,
        `@okta/okta-react-native/${version} $UPSTREAM_SDK react-native/${version} ios/1.0.0`,
      );
    });

    it('passes in correct parameters on android device', () => {
      Platform.OS = 'android';
      Platform.Version = '1.0.0';
      createConfig(config);
      expect(mockCreateConfig).toHaveBeenCalledTimes(1);
      expect(mockCreateConfig).toHaveBeenCalledWith(
        config.clientId,
        config.redirectUri,
        config.endSessionRedirectUri,
        config.discoveryUri,
        config.scopes,
        `@okta/okta-react-native/${version} $UPSTREAM_SDK react-native/${version} android/1.0.0`,
        config.requireHardwareBackedKeyStore,
        undefined,
        {},
        false,
      );
    });

    it('passes in correct parameters on android device with androidChromeTabColor', () => {
      Platform.OS = 'android';
      Platform.Version = '1.0.0';

      const configWithColor = Object.assign({}, config, { androidChromeTabColor: '#FF00AA' });
      createConfig(configWithColor);
      expect(mockCreateConfig).toHaveBeenCalledTimes(1);
      expect(mockCreateConfig).toHaveBeenLastCalledWith(
        config.clientId,
        config.redirectUri,
        config.endSessionRedirectUri,
        config.discoveryUri,
        config.scopes,
        `@okta/okta-react-native/${version} $UPSTREAM_SDK react-native/${version} android/1.0.0`,
        config.requireHardwareBackedKeyStore,
        '#FF00AA',
        {},
        false,
      );
    });
    
    it('passes in correct parameters on android device with browserMatchAll', () => {
      Platform.OS = 'android';
      Platform.Version = '1.0.0';

      const configWithColor = Object.assign({}, config, { browserMatchAll: true });
      createConfig(configWithColor);
      expect(mockCreateConfig).toHaveBeenCalledTimes(1);
      expect(mockCreateConfig).toHaveBeenLastCalledWith(
        config.clientId,
        config.redirectUri,
        config.endSessionRedirectUri,
        config.discoveryUri,
        config.scopes,
        `@okta/okta-react-native/${version} $UPSTREAM_SDK react-native/${version} android/1.0.0`,
        config.requireHardwareBackedKeyStore,
        undefined,
        {},
        true,
      );
    });

    it('passes in correct parameters on android device with timeouts', () => {
      Platform.OS = 'android';
      Platform.Version = '1.0.0';

      const configWithColor = Object.assign({}, config, { httpConnectionTimeout: 12, httpReadTimeout: 34 });
      createConfig(configWithColor);
      expect(mockCreateConfig).toHaveBeenCalledTimes(1);
      expect(mockCreateConfig).toHaveBeenLastCalledWith(
        config.clientId,
        config.redirectUri,
        config.endSessionRedirectUri,
        config.discoveryUri,
        config.scopes,
        `@okta/okta-react-native/${version} $UPSTREAM_SDK react-native/${version} android/1.0.0`,
        config.requireHardwareBackedKeyStore,
        undefined,
        { httpConnectionTimeout: 12, httpReadTimeout: 34 },
        false,
      );
    });
  });

  describe('signInTest', () => {
    let mockSignIn;

    beforeEach(() => {
      mockSignIn = require('react-native').NativeModules.OktaSdkBridge.signIn;
      mockSignIn.mockReset();
    });

    it('calls native sign in method', () => {
      signIn();
      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenLastCalledWith({});
    });
  });

  describe('signInTest with credentials', () => {
    let mockAuthenticate;
    const signInCredentials = { username: 'okta.user', password: 'secure-pass-123!' };
    const sessionToken = 'Dummy-Session-token-1234';
    const authToken = 'Dummy-Auth-Token-6789';

    beforeEach(() => {
      mockAuthenticate = require('react-native').NativeModules.OktaSdkBridge.authenticate;
      mockAuthenticate.mockReset();
      mockSignInOktaAuth.mockReset();
    });

    it('sign-in succeed, authentication succeed', async () => {
      mockSignInOktaAuth.mockImplementation().mockResolvedValueOnce({ status: 'SUCCESS', sessionToken: sessionToken });
      mockAuthenticate.mockResolvedValueOnce(authToken);
      
      await expect(signIn(signInCredentials)).resolves.toEqual(authToken);
      
      expect(mockSignInOktaAuth).toHaveBeenCalledTimes(1);
      expect(mockSignInOktaAuth).toHaveBeenLastCalledWith(signInCredentials);
      expect(mockAuthenticate).toHaveBeenCalledTimes(1);
      expect(mockAuthenticate).toHaveBeenLastCalledWith(sessionToken);
    });

    it('sign-in method fails', () => {
      mockSignInOktaAuth.mockImplementation().mockRejectedValueOnce(
        { 
          error_code: '1001', 
          error_message: 'Error occured during sign-in method call.' 
        });
      
      return signIn(signInCredentials).catch(givenError => {
        expect(mockSignInOktaAuth).toHaveBeenCalledTimes(1);
        expect(mockSignInOktaAuth).toHaveBeenLastCalledWith(signInCredentials);
        expect(mockAuthenticate).toHaveBeenCalledTimes(0);
        expect(givenError.code).toEqual('-1000');
        expect(givenError.message).toEqual('Sign in was not authorized');
        expect(typeof givenError.detail.error_code).toBe('string');
        expect(typeof givenError.detail.error_message).toEqual('string');
      });
    });

    it('sign-in method succeed, authentication fails', () => {
      mockSignInOktaAuth.mockImplementation().mockResolvedValueOnce({ status: 'SUCCESS', sessionToken: sessionToken });
      mockAuthenticate.mockRejectedValue({ 
        error_code: '1001', 
        error_message: 'Error occured during sign-in method call.' 
      });
      
      return signIn(signInCredentials).catch(authError => {
        expect(mockSignInOktaAuth).toHaveBeenCalledTimes(1);
        expect(mockSignInOktaAuth).toHaveBeenLastCalledWith(signInCredentials);
        expect(mockAuthenticate).toHaveBeenCalledTimes(1);
        expect(authError.code).toEqual('-1000');
        expect(authError.message).toEqual('Sign in was not authorized');
        expect(typeof authError.detail.error_code).toBe('string');
        expect(typeof authError.detail.error_message).toBe('string');
      });
    });

    it('sign-in method succeed, authentication succeed but token null', () => {
      mockSignInOktaAuth.mockImplementation().mockResolvedValueOnce({ status: 'SUCCESS', sessionToken: sessionToken });
      mockAuthenticate.mockResolvedValueOnce(null);
      
      return signIn(signInCredentials).catch(authError => {
        expect(mockSignInOktaAuth).toHaveBeenCalledTimes(1);
        expect(mockSignInOktaAuth).toHaveBeenLastCalledWith(signInCredentials);
        expect(mockAuthenticate).toHaveBeenCalledTimes(1);
        expect(authError.code).toEqual('-1000');
        expect(authError.message).toEqual('Sign in was not authorized');
        expect(authError.detail).not.toBeUndefined();
        expect(authError.detail).not.toBeNull();
      });
    });

    it('sign-in method succeed, authentication succeed, status not SUCCESS', () => {
      mockSignInOktaAuth.mockImplementation().mockResolvedValueOnce({ status: 'LOCKED_OUT', sessionToken: sessionToken });
      mockAuthenticate.mockResolvedValueOnce(authToken);

      return signIn(signInCredentials).catch(statusError => {
        expect(mockSignInOktaAuth).toHaveBeenCalledTimes(1);
        expect(mockSignInOktaAuth).toHaveBeenLastCalledWith(signInCredentials);
        expect(mockAuthenticate).toHaveBeenCalledTimes(0);
        expect(statusError.message).toEqual('Sign in was not authorized');
        expect(statusError.detail.status).toEqual('LOCKED_OUT');
      });
    });
  });
  
  describe('signInWithBrowser', () => {
    let mockSignInWithBrowser;

    beforeEach(() => {
      mockSignInWithBrowser = require('react-native').NativeModules.OktaSdkBridge.signIn;
      mockSignInWithBrowser.mockReset();
    });

    it('calls native sign in method with idp on iOS', () => {
      signInWithBrowser({idp: 'test-idp'});
      expect(mockSignInWithBrowser).toHaveBeenCalledTimes(1);
      expect(mockSignInWithBrowser).toHaveBeenLastCalledWith({idp: 'test-idp'});
    });
  });

  describe('authenticateTest', () => {
    let mockAuthenticate;

    beforeEach(() => {
      mockAuthenticate = require('react-native').NativeModules.OktaSdkBridge.authenticate;
      mockAuthenticate.mockReset();
    });

    it('calls native authenticate method', () => {
      authenticate({sessionToken: 'sessionToken'});
      expect(mockAuthenticate).toHaveBeenCalledTimes(1);
      expect(mockAuthenticate).toHaveBeenLastCalledWith('sessionToken');
    });
  });

  describe('signOutTest', () => {
    let mockSignOut;

    beforeEach(() => {
      mockSignOut = require('react-native').NativeModules.OktaSdkBridge.signOut;
    });

    it('calls native sign out method', () => {
      signOut();
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getAccessTokenTest', () => {
    let mockGetAccessToken;

    beforeEach(() => {
      mockGetAccessToken = require('react-native').NativeModules.OktaSdkBridge.getAccessToken;
    });

    it('gets access token successfully', async () => {
      mockGetAccessToken.mockReturnValueOnce('dummy_access_token');

      await expect(getAccessToken()).resolves.toEqual('dummy_access_token');
    });
  });

  describe('getIdTokenTest', () => {
    let mockGetIdToken;

    beforeEach(() => {
      mockGetIdToken = require('react-native').NativeModules.OktaSdkBridge.getIdToken;
      mockGetIdToken.mockReset();
    });

    it('gets id token successfully', async () => {
      mockGetIdToken.mockReturnValueOnce({'id_token': 'dummy_id_token'});

      await expect(getIdToken()).resolves.toEqual({'id_token': 'dummy_id_token'});
    });
  });

  describe('getUserTest', () => {
    let mockGetUser;

    beforeEach(() => {
      mockGetUser = require('react-native').NativeModules.OktaSdkBridge.getUser;
      mockGetUser.mockReset();
    });

    it('gets id token successfully', async () => {
      mockGetUser.mockResolvedValueOnce({
        'name': 'Joe Doe',
        'sub': '00uid4BxXw6I6TV4m0g3',
      });

      await expect(getUser()).resolves.toEqual({
        'name': 'Joe Doe',
        'sub': '00uid4BxXw6I6TV4m0g3',
      });
    });

    it('gets id token successfully from json string result', async () => {
      mockGetUser.mockResolvedValueOnce('{"name":"Joe Doe","sub":"00uid4BxXw6I6TV4m0g3"}');
      
      await expect(getUser()).resolves.toEqual({
        'name': 'Joe Doe',
        'sub': '00uid4BxXw6I6TV4m0g3',
      });
    });

    it('gets parsing error', () => {
      mockGetUser.mockResolvedValueOnce('{ ; }');

      return getUser().catch(error => {
        expect(error.code).toEqual('-600');
        expect(error.message).toEqual('Okta Oidc error');
        expect(error.detail).not.toBeUndefined();
        expect(error.detail).not.toBeNull();
      });
    });
  });

  describe('getUserFromIdToken', () => {
    let mockGetIdToken;
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoiYiJ9.jiMyrsmD8AoHWeQgmxZ5yq8z0lXS67_QGs52AzC8Ru8';

    beforeEach(() => {
      mockGetIdToken = require('react-native').NativeModules.OktaSdkBridge.getIdToken;
      mockGetIdToken.mockReset();
    });

    it('gets user from id token successfully', async () => {
      mockGetIdToken.mockReturnValueOnce({
        'id_token': token,
      });
      
      await expect(getUserFromIdToken()).resolves.toEqual({
        a: 'b',
      });
    });
  });

  describe('isAuthenticatedTest', () => {
    let mockIsAuthenticated;

    beforeEach(() => {
      mockIsAuthenticated = require('react-native').NativeModules.OktaSdkBridge.isAuthenticated;
      mockIsAuthenticated.mockReset();
    });

    it('is authenticated', async () => {
      mockIsAuthenticated.mockReturnValueOnce(true);
      
      await expect(isAuthenticated()).resolves.toEqual(true);
    });
  });

  describe('revokeAccessTokenTest', () => {
    let mockRevokeAccessToken;

    beforeEach(() => {
      mockRevokeAccessToken = require('react-native').NativeModules.OktaSdkBridge.revokeAccessToken;
      mockRevokeAccessToken.mockReset();
    });

    it('successfully revokes access token', async () => {
      mockRevokeAccessToken.mockReturnValueOnce(true);
      
      await expect(revokeAccessToken()).resolves.toEqual(true);
    });
  });

  describe('revokeIdTokenTest', () => {
    let mockRevokeIdToken;

    beforeEach(() => {
      mockRevokeIdToken = require('react-native').NativeModules.OktaSdkBridge.revokeIdToken;
      mockRevokeIdToken.mockReset();
    });

    it('successfully revokes id token', async () => {
      mockRevokeIdToken.mockReturnValueOnce(true);
      
      await expect(revokeIdToken()).resolves.toEqual(true);
    });
  });

  describe('revokeRefreshTokenTest', () => {
    let mockRevokeIdToken;

    beforeEach(() => {
      mockRevokeIdToken = require('react-native').NativeModules.OktaSdkBridge.revokeRefreshToken;
      mockRevokeIdToken.mockReset();
    });

    it('successfully revokes id token', async () => {
      mockRevokeIdToken.mockReturnValueOnce(true);
      
      await expect(revokeRefreshToken()).resolves.toEqual(true);
    });
  });

  describe('introspectAccessTokenTest', () => {
    let mockIntrospectAccessToken;

    beforeEach(() => {
      mockIntrospectAccessToken = require('react-native').NativeModules.OktaSdkBridge.introspectAccessToken;
      mockIntrospectAccessToken.mockReset();
    });

    it('introspects the access token', async () => {
      mockIntrospectAccessToken.mockReturnValueOnce({
        'active': true,
        'token_type': 'Bearer',
        'client_id': 'dummy_client_id'
      });

      
      await expect(introspectAccessToken()).resolves.toEqual({
        'active': true,
        'token_type': 'Bearer',
        'client_id': 'dummy_client_id'
      });
    });
  });

  describe('introspectIdTokenTest', () => {
    let mockIntrospectIdToken;

    beforeEach(() => {
      mockIntrospectIdToken = require('react-native').NativeModules.OktaSdkBridge.introspectIdToken;
      mockIntrospectIdToken.mockReset();
    });

    it('introspects the id token', async () => {
      mockIntrospectIdToken.mockReturnValueOnce({
        'active': true,
        'client_id': 'dummy_client_id'
      });
      
      await expect(introspectIdToken()).resolves.toEqual({
        'active': true,
        'client_id': 'dummy_client_id'
      });
    });
  });

  describe('introspectRefreshTokenTest', () => {
    let mockIntrospectRefreshToken;

    beforeEach(() => {
      mockIntrospectRefreshToken = require('react-native').NativeModules.OktaSdkBridge.introspectRefreshToken;
      mockIntrospectRefreshToken.mockReset();
    });

    it('introspects the refresh token', async () => {
      mockIntrospectRefreshToken.mockReturnValueOnce({
        'active': true,
        'client_id': 'dummy_client_id'
      });
      
      await expect(introspectRefreshToken()).resolves.toEqual({
        'active': true,
        'client_id': 'dummy_client_id'
      });
    });
  });

  describe('refreshTokensTest', () => {
    let mockRefreshTokens;

    beforeEach(() => {
      mockRefreshTokens = require('react-native').NativeModules.OktaSdkBridge.refreshTokens;
      mockRefreshTokens.mockReset();
    });

    it('refreshes tokens', async () => {
      mockRefreshTokens.mockReturnValueOnce(true);
      
      await expect(refreshTokens()).resolves.toEqual(true);
    });
  });

  describe('clearTokensTest', () => {
    let mockClearTokens;

    beforeEach(() => {
      mockClearTokens = require('react-native').NativeModules.OktaSdkBridge.clearTokens;
      mockClearTokens.mockReset();
    });

    it('refreshes tokens', async () => {
      mockClearTokens.mockReturnValueOnce(true);
      
      await expect(clearTokens()).resolves.toEqual(true);
    });
  });
});

