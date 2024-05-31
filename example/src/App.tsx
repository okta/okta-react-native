import * as React from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  addListener,
  clearTokens,
  createConfig,
  getAccessToken,
  getIdToken,
  getUser,
  getUserFromIdToken,
  introspectAccessToken,
  introspectIdToken,
  introspectRefreshToken,
  isAuthenticated,
  refreshTokens,
  revokeAccessToken,
  revokeIdToken,
  revokeRefreshToken,
  signInWithBrowser,
  signOut,
} from 'react-native-okta-react-native';

const CONFIG = {
  clientId: '',
  redirectUri: '',
  endSessionRedirectUri: '',
  discoveryUri: '',
  requireHardwareBackedKeyStore: false,
  idp: '',
  scopes: ['openid', 'profile', 'offline_access'],
};

export default function App() {
  const createConfigOKTA = async () => {
    const res = await createConfig(CONFIG);
    console.log({ res });
  };

  const signinOKTA = async () => {
    signInWithBrowser({
      idp: CONFIG.idp,
      noSSO: true,
    })
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  };

  const signOutOkta = async () => {
    const res = await signOut();
    console.log({ res });
  };

  const getAccessTokenOkta = async () => {
    const res = await getAccessToken();
    console.log({ res });
  };

  const getIdTokenOkta = async () => {
    const res = await getIdToken();
    console.log({ res });
  };
  const getUserOkta = async () => {
    const res = await getUser();
    console.log({ res });
  };
  const getUserFromIdTokenOkta = async () => {
    const res = await getUserFromIdToken();
    console.log({ res });
  };
  const isAuthenticatedOkta = async () => {
    const res = await isAuthenticated();
    console.log({ res });
  };
  const revokeAccessTokenOkta = async () => {
    const res = await revokeAccessToken();
    console.log({ res });
  };
  const revokeIdTokenOkta = async () => {
    const res = await revokeIdToken();
    console.log({ res });
  };
  const revokeRefreshTokenOkta = async () => {
    const res = await revokeRefreshToken();
    console.log({ res });
  };

  const introspectAccessTokenOkta = async () => {
    const res = await introspectAccessToken();
    console.log({ res });
  };
  const introspectIdTokenOkta = async () => {
    const res = await introspectIdToken();
    console.log({ res });
  };
  const introspectRefreshTokenOkta = async () => {
    const res = await introspectRefreshToken();
    console.log({ res });
  };
  const refreshTokensOkta = async () => {
    const res = await refreshTokens();
    console.log({ res });
  };
  const clearTokensOkta = async () => {
    const res = await clearTokens();
    console.log({ res });
  };

  React.useEffect(() => {
    const unsubscribeOK = addListener('signInSuccess', (evt) => {
      console.log('SignInSuccess', { evt });
    });
    const unsubscribeError = addListener('onError', (evt) => {
      console.log('onError', { evt });
    });

    const unsubscribeCanceled = addListener('onCancelled', () => {
      console.log('User Cancelled');
    });

    return () => {
      unsubscribeOK.remove();
      unsubscribeError.remove();

      unsubscribeCanceled.remove();
    };
  }, []);
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={styles.container}>
          <Button title="Create Config" onPress={createConfigOKTA} />
          <Button title="Sign In" onPress={signinOKTA} />
          <Button title="Sign Out" onPress={signOutOkta} />
          <Button title="Get access token" onPress={getAccessTokenOkta} />
          <Button title="Get ID token" onPress={getIdTokenOkta} />
          <Button title="Get User" onPress={getUserOkta} />
          <Button
            title="Get User from ID Token"
            onPress={getUserFromIdTokenOkta}
          />
          <Button title="Is Authenticated" onPress={isAuthenticatedOkta} />
          <Button title="Revoke Access Token" onPress={revokeAccessTokenOkta} />
          <Button title="Revoke ID Token" onPress={revokeIdTokenOkta} />
          <Button
            title="Revoke Refresh Token"
            onPress={revokeRefreshTokenOkta}
          />
          <Button
            title="Introspect Access Token"
            onPress={introspectAccessTokenOkta}
          />
          <Button title="Introspect ID Token" onPress={introspectIdTokenOkta} />
          <Button
            title="Introspect Refresh Token"
            onPress={introspectRefreshTokenOkta}
          />
          <Button title="Refresh Token" onPress={refreshTokensOkta} />
          <Button title="Clear Token" onPress={clearTokensOkta} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingVertical: 12,
    rowGap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
