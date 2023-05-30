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

/* eslint-disable no-unused-vars */
/* eslint-disable node/no-missing-import */

import React from 'react';
import { 
  Text,
  Button, 
  StyleSheet, 
  TextInput,
  View,
} from 'react-native';

import {
  signOut,
  revokeAccessToken,
  revokeIdToken,
  clearTokens,
  getAccessToken,
  getAuthClient,
} from '@okta/okta-react-native';

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      idToken: props.route.params.idToken,
      isBrowserScenario: props.route.params.isBrowserScenario,
      userInfo: {}
    };
  }

  async getUserInfo() {
    const oktaAuth = getAuthClient();
    const issuer = oktaAuth.options.issuer;
    const baseUrl = issuer.indexOf('/oauth2') > 0 ? issuer : issuer + '/oauth2';
    const accessToken = await getAccessToken();
    const url = baseUrl + '/v1/userinfo';
    const headers = {
      'Authorization': 'Bearer ' + accessToken.access_token
    };
    const resp = await fetch(url, {
      method: 'GET',
      headers,
    });
    const userInfo = await resp.json();
    this.setState({
      ...this.state,
      userInfo,
    });
  }

  componentDidMount() {
    this.getUserInfo();
  }

  logout = () => {
    if (this.state.isBrowserScenario == true) {
      signOut().then(() => {
        this.props.navigation.popToTop();
      }).catch(error => {
        console.log(error);
      });
    }

    Promise.all([revokeAccessToken(), clearTokens()])
      .then(() => {
        this.props.navigation.popToTop();
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    const userName = this.state.userInfo.name;
    const preferredUserName = this.state.idToken.preferred_username;
    return (
      <View style={styles.container}>
        {userName && <Text testID="user_name">User: {userName}</Text>}
        <Text testID="welcome_text">Welcome back, {preferredUserName}!</Text>
        <Button 
          onPress={this.logout}
          title="Logout"
          testID="logout_button"
        />
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