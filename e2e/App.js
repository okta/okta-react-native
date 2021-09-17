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

import React from 'react';
import { 
  Button, 
  StyleSheet, 
  Text,
  View, 
  Alert, 
  ActivityIndicator 
} from 'react-native';

import {
  createConfig,
  introspectAccessToken,
  introspectIdToken,
  signInWithBrowser,
  signOut,
} from '@okta/okta-react-native';

import configFile from './config';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      authenticated: false, 
      idToken: '',
      isLoading: false
    };  
  }
  
  async componentDidMount() {
    await createConfig({
      clientId: configFile.oidc.clientId,
      redirectUri: configFile.oidc.redirectUri,
      endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
      discoveryUri: configFile.oidc.discoveryUri,
      scopes: configFile.oidc.scopes,
      requireHardwareBackedKeyStore:
        configFile.oidc.requireHardwareBackedKeyStore
    });

    this.setInitialState();
  }

  setInitialState = () => {
    this.setState({ isLoading: true });

    introspectAccessToken()
      .then(() => {
        introspectIdToken()
          .then(idToken => {
            this.setState({ authenticated: true, idToken: idToken });
          })
          .catch(error => {
            console.warn(error);
            this.setState({ authenticated: true, idToken: '' });
          })
          .finally(() => {
            this.setState({ isLoading: false }); 
          });
      })
      .catch(() => {
        this.setState({ authenticated: false, isLoading: false });
      });
  }

  login = () => {
    signInWithBrowser()
      .then(() => {
        this.setInitialState();
      })
      .catch(error => {
        // Cancellation error
        if (error.code == '-1200') {
          return;
        }

        console.warn(error);

        Alert.alert(
          error.message,
          [
            { 
              text: 'OK', 
              style: 'cancel' 
            }
          ]
        );
      });
  }

  logout = () => {
    signOut().then(() => {
      this.setState({ authenticated: false });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    if (this.state.authenticated) {
      return (
        <View style={styles.container}>
          <Text>Welcome back, {this.state.idToken.preferred_username}!</Text>
          <Button onPress={this.logout}  title="Logout" />
        </View>
      ); 
    }

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Button onPress={this.login}  title="Login" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
