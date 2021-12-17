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
  Alert,
  Button, 
  StyleSheet, 
  TextInput,
  View,  
  ActivityIndicator 
} from 'react-native';

import {
  signIn,
  introspectIdToken
} from '@okta/okta-react-native';

export default class CustomLogin extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      isLoading: false,
      username: '',
      password: '',
    };  
  }
  
  async componentDidMount() {
    
  }

  signInCustom = () => {
    this.setState({ isLoading: true });
    signIn({ username: this.state.username, password: this.state.password })
      .then(() => {
        introspectIdToken()
          .then(idToken => {
            this.props.navigation.navigate('ProfilePage', { idToken: idToken, isBrowserScenario: false });
          }).finally(() => {
            this.setState({ 
              isLoading: false,
              username: '', 
              password: '',
            });
          });
      })
      .catch(error => {
        // For some reason the app crashes when only one button exist (only with loaded bundle, debug is OK) 🤦‍♂️
        Alert.alert(
          "Error",
          error.message,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
    

        this.setState({
          isLoading: false
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.input}
          placeholder='Username'
          onChangeText={input => this.setState({ username: input })}
          testID="username_input"
        />
        <TextInput 
          style={styles.input}
          placeholder='Password'
          onChangeText={input => this.setState({ password: input })}
          testID="password_input"
        />
        <Button 
          onPress={this.signInCustom} 
          title="Sign in" 
          testID='sign_in_button' 
        />
        <View style={styles.flexible}></View>
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
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  flexible: {
    flex: 1,
  }
});
