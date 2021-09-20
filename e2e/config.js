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

// import { CLIENT_ID, REDIRECT_URI, LOGOUT_REDIRECT_URI, ISSUER } from '@env';

/* 
  clientId, redirectUri, endSessionRedirectUri - these values can be found on the "General" tab of the application that you created earlier in Admin Console.
  discoveryUri - this is the URL of the authorization server that will perform authentication.

  For more details, https://developer.okta.com/docs/guides/sign-into-mobile-app/create-okta-application/
*/ 

export default {
  oidc: {
    clientId: '0oaaq9bhqCWN0Cgch5d6', // e.g.: `a0abcEf0gH123ssJS4o5`
    redirectUri: 'dev.okta.com:/callback', // e.g.: `com.okta.example:/callback`
    endSessionRedirectUri: 'dev.okta.com:/logout', // e.g.: com.okta.example:/logout
    discoveryUri: 'https://dev-31435904.okta.com/oauth2/default/', // e.g.: https://dev-1234.okta.com/
    scopes: ['openid', 'profile', 'offline_access'], 
    requireHardwareBackedKeyStore: false,
  },
};
