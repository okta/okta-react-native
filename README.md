[![npm version](https://img.shields.io/npm/v/@okta/okta-react-native.svg?style=flat-square)](https://www.npmjs.com/package/@okta/okta-react-native)
[![build status](https://img.shields.io/travis/okta/okta-react-native/master.svg?style=flat-square)](https://travis-ci.org/okta/okta-react-native)

[<img src="https://www.okta.com/sites/default/files/Dev_Logo-01_Large-thumbnail.png" align="right" width="256px"/>](https://devforum.okta.com/)

# Okta React Native

  - [Prerequisites](#prerequisites)
  - [Configure an OpenID Connect Client](#configure-an-openid-connect-client-in-okta)
  - [Getting started](#getting-started)
    - [iOS Setup](#ios-setup)
    - [Android Setup](#android-setup)
  - [Usage guide](#usage)
  - [Migrating between versions](#migrating-between-versions)
  - [Contributing](#contributing)

The Okta React Native library makes it easy to add authentication to your React Native app. This library is a wrapper around [Okta OIDC Android](https://github.com/okta/okta-oidc-android) and [Okta OIDC iOS](https://github.com/okta/okta-oidc-ios).

This library follows the current best practice for native apps using:

* [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1)
* [Proof Key for Code Exchange (PKCE)](https://tools.ietf.org/html/rfc7636)

This library also exposes APIs to interact with [Authentication API](https://developer.okta.com/docs/api/resources/authn) directly to implement native UI for authentication. The library supports two flows in your React Native application:
* **[Browser Sign In](#browser-sign-in)** - redirects the user to the Okta browser login page of your Org for authentication. The user is redirected back to the React Native application after authenticating.
* **[Custom Sign In](#custom-sign-in)** - A React Native application that adopts native authorization to take control over authorization flow and/or provide custom UI.

You can learn more on the [Okta + ReactNative](https://developer.okta.com/code/react-native/) page in our documentation. You can also download our [sample applications](https://github.com/okta/samples-js-react-native).

## Prerequisites

* If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).
* If you don't have a React Native app, or are new to React Native, please continue with the [React Native CLI Quickstart](https://facebook.github.io/react-native/docs/getting-started) guide. It will walk you through the creation of a React Native app and other application development essentials.
* If you are developing with an Android device emulator, make sure to check out the [React Native - Android Development](https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment) setup instructions.

## Configure an OpenID Connect Client in Okta

In Okta, applications are OpenID Connect clients that can use Okta Authorization servers to authenticate users.  Your Okta Org already has a default authorization server, so you just need to create an OIDC client that will use it.

* Log into the Okta Developer Dashboard, click **Applications** then **Add Application**.
* Choose **Native** as the platform, then submit the form the default values, which should look similar to this:

| Setting             | Value                                        |
| ------------------- | -------------------------------------------- |
| App Name            | My Native App                                |
| Login redirect URIs | com.mynative.app:/                            |
| Grant Types Allowed | Authorization Code, Refresh Token            |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.   |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |

**Note:** *As with any Okta application, make sure you assign Users or Groups to the OpenID Connect Client. Otherwise, no one can use it.*

These values will be used in your React application to setup the OpenID Connect flow with Okta.

## Getting started

This library is available through [npm](https://www.npmjs.com/package/@okta/okta-react-native). To install it, simply add it to your project:

```
$ npm install @okta/okta-react-native --save
```

### iOS Setup

To setup iOS, there are three steps that you must take.

1. [Make sure your iOS app's deployment target is `11.0` and above.](#set-ios-deployment-target)
2. [Install Okta Open ID Connect iOS.](#install-okta-open-id-connect-ios)
3. [Make sure you also configure Swift.](#swift-configuration)

#### Set iOS Deployment Target

This library supports iOS version `11.0` and above. Go to your project -> `Build settings` -> `iOS Deployment Target`, and set it to at least version `11.0`.  

#### Install Okta Open ID Connect iOS
This library depends on the native [Okta OIDC iOS](https://github.com/okta/okta-oidc-ios) library. It is not distributed as part of the React Native library to keep your dependency management consistent. 

You can currently add Okta OIDC iOS through CocoaPods:

1. [**CocoaPods**]((https://guides.cocoapods.org/using/getting-started.html))

   ***React Native >= 0.60***: With React Native 0.60 pods are added to `Podfile` automatically. Run the commands to install dependencies:
   ```
   cd ios
   pod install --repo-update
   ```
   ***React Native < 0.60***: Make sure your `Podfile` looks like this:
    ```   
   platform :ios, '11.0'

   target '{YourTargetName}' do

   pod 'OktaOidc', '~> 3.10.4'

   end
   ```

   Then run `pod install`.
   
2. **Carthage**
   With [Carthage](https://github.com/Carthage/Carthage), add the following line to your Cartfile:

    ```
    github "okta/okta-oidc-ios" ~> 3.10.4
    ```
   Then run `carthage update --platform iOS`.

   Open project settings and choose your application target. Then open `Build Phases` and add `OktaOidc.framework` from `ios/Carthage/Build/iOS` into `Embed Frameworks` section

### Android Setup

For Android, there are two steps that you must take:
1. [Installing Okta Open Id Connect Android.](#install-okta-open-id-connect-android)
2. [Add a redirect scheme to your project.](#add-redirect-scheme)

#### Install Okta Open ID Connect Android
This library depends on the native [Okta OIDC Android](https://github.com/okta/okta-oidc-android) library. You have to add this library through Gradle. Follow the following steps:

1. Add this line to `android/build.gradle`, under `allprojects` -> `repositories`.
    ```
    mavenCentral()
    ```
    
2. Make sure your `minSdkVersion` is `21` in `android/build.gradle`.

#### Add redirect scheme

Defining a redirect scheme to capture the authorization redirect. In `android/app/build.gradle`, under `android` -> `defaultConfig`, add:
```
manifestPlaceholders = [
  appAuthRedirectScheme: 'com.sampleapplication'
]
```

## Usage

You will need the values from the OIDC client that you created in the previous step to set up. You will also need to know your Okta Org URL, which you can see on the home page of the Okta Developer console.

Before calling any other method, it is important that you call `createConfig` to set up the configuration properly on the native modules.

Importing methods would follow this pattern: 

```javascript
import { createConfig, signIn, signOut, getAccessToken } from '@okta/okta-react-native';
```

### `createConfig`

This method will create a configured client on the native modules. Resolves `true` if successfully configures a client.

* `issuer` is an optional field in config, for more information please refer to [About the Issuer](https://github.com/okta/okta-auth-js/tree/master#about-the-issuer).
* `redirectUri` and `endSessionRedirectUri` must not be the same, otherwise Android will throw an error on `signOut`.
* `requireHardwareBackedKeyStore` is a configurable setting only on Android devices. If you're a developer testing on Android emulators, set this field to `false`. 
* `androidChromeTabColor` is an optional field in config, and is used only by _Android_ for the Chrome Custom Tabs color for the OIDC flow.
* `browserMatchAll` is an optional field in config, and is used only by _Android_ to match all Chrome Custom Tabs browsers.
* `httpConnectionTimeout` is an optional field in config, represented in seconds. Available on _iOS_ and _Android_.
* `httpReadTimeout` is an optional field in config, represented in seconds. Available only on _Android_.

```javascript
await createConfig({
  issuer: "https://{yourOktaDomain}/oauth2/default", // Optional
  clientId: "{clientId}",
  redirectUri: "{redirectUri}",
  endSessionRedirectUri: "{endSessionRedirectUri}",
  discoveryUri: "https://{yourOktaDomain}",
  scopes: ["openid", "profile", "offline_access"],
  requireHardwareBackedKeyStore: true, // Optional
  androidChromeTabColor: "#FF00AA", // Optional
  browserMatchAll: true, // Optional
  httpConnectionTimeout: 15, // Optional
  httpReadTimeout: 10, // Optional
});
``` 

### `getAuthClient`

This method will return an instance of [`@okta/okta-auth-js`](https://github.com/okta/okta-auth-js) client to communicate with Okta Authentication API. For more information, please checkout [Okta AuthJs Node JS and React Native Usage](https://github.com/okta/okta-auth-js#node-js-and-react-native-usage) section.

### `signIn`

This method will handle both `browser-sign-in` and `custom-sign-in` scenarios based on provided options.

This async method will automatically redirect users to your Okta organziation for authentication. It will emit an event once a user successfully signs in. Make sure your event listeners are mounted and unmounted. Note: on iOS there isn't a `onCancelled` event. If the sign in process is cancelled, `onError` will be triggered.

#### `browser-sign-in`
`browser-sign-in` leverages device's native browser to automatically redirect users to your Okta organziation for authentication. By providing no argument, this method will trigger the `browser-sign-in` flow. It will emit an event once a user successfully signs in. Make sure your event listeners are mounted and unmounted. 

**Note**: on iOS there isn't a `onCancelled` event. If the sign in process is cancelled, `onError` will be triggered.

```javascript
await signInWithBrowser();
```

**Note**: IDP can be passed by specifying an argument with the idp parameter.

```javascript
await signInWithBrowser({ idp: 'your_idp_here' });
```

**Note**: If you want to get rid of the system sign in and sign out alert on iOS, then pass the `noSSO` parameter when calling `signInWithBrowser`. The cookies will not be retained by the browser, so after logging out the user will be prompted to re-authenticate.

```javascript
await signInWithBrowser({ noSSO: true });
```

##### Sample Usage
```javascript
signInWithBrowser({ noSSO: true })
  .then(result => {
    // Consume accessToken from result.access_token
  })
  .catch(error => {
    // { code: "", message: "", detail: { message: "", status: "" } }
    // handle error
  })
```

#### `custom-sign-in`
`custom-sign-in` provides the way to authenticate the user within the native application. By providing `options` object with username and password fields, this method will retrieve `sessionToken` then exchange it for `accessToken`. 
Both `Promise` and `Event listeners` are supported. This method is leveraging `@okta/okta-auth-js` SDK to perform authentication API request. For more information, please checkout [Okta AuthJs signIn options](https://github.com/okta/okta-auth-js#signinoptions) section.

##### Sample Usage
```javascript
signIn({ username: "{username}", password: "{password}" })
  .then(token => {
    // consume accessToken from token.access_token
  })
  .catch(error => {
    // { code: "", message: "", detail: { message: "", status: "" } }
    // handle error
  })
```

##### Sample Usage

```javascript
import { signIn, EventEmitter } from '@okta/okta-react-native';

componentDidMount() {
  this.signInSuccess = EventEmitter.addListener('signInSuccess', function(e: Event) {
    console.log(e.access_token);
    // Do something ...
  });
  this.signOutSuccess = EventEmitter.addListener('signOutSuccess', function(e: Event) {
    //...
  });
  this.onError = EventEmitter.addListener('onError', function(e: Event) {
    //...
  });
  this.onCancelled = EventEmitter.addListener('onCancelled', function(e: Event) {
    //...
  });
}

componentWillUnmount() {
  this.signInSuccess.remove();
  this.signOutSuccess.remove();
  this.onError.remove();
  this.onCancelled.remove();
}

``` 

### `authenticate`

If you already logged in to Okta and have a valid session token, you can complete authorization by calling `authenticate` method. It will emit an event once a user successfully signs in. Make sure your event listeners are mounted and unmounted. Note: on iOS there isn't a `onCancelled` event. If the `authenticate` process is cancelled, `onError` will be triggered.

```javascript
await authenticate({sessionToken: sessionToken});
```

### `signOut`

Clears the browser session and the app session (stored tokens) in memory. Fires an event once a user successfully logs out. For sample usage, refer to `signIn`.

**Note**: This method apply for [browser-sign-in](#browser-sign-in) scenario only. Use a combination of `revokeToken` (optional) and `clearTokens` methods to sign out when use [custom-sign-in](#custom-sign-in).

#### browser-sign-in sample

```javascript
await signOut();
```

#### custom-sign-in sample

```javascript
await revokeAccessToken(); // optional
await revokeIdToken(); // optional
await clearTokens();
```

### `isAuthenticated`

Returns a promise that resolves to `true` if there is a valid Access token and ID token. Otherwise `false`.

**Note**: This does not mean that the Access and the ID tokens are fresh - just that they were valid the last time they were used. You should introspect the tokens to get know whether they are valid at the time being.

```javascript
await isAuthenticated();
```

##### Sample Response

If authenticated: 

```javascript
{
  "authenticated": true
}
```



### `getAccessToken`

This method returns a promise that will return the access token as a string. If no access token is available (either does not exist, or expired), then the promise will be rejected.

```javascript
await getAccessToken();
```

##### Sample Response

If the access token is available:

```javascript
{
  "access_token": "{accessToken}"
}
```

### `getIdToken`

This method returns a promise that will return the identity token as a string. The promise will be rejected if no ID token is available. 

```javascript
await getIdToken();
```

##### Sample Response

If the ID token is available:

```javascript
{
  "id_token": "{idToken}"
}
```

### `getUser`

Returns a promise that will fetch the most up-to-date user claims from the [OpenID Connect `/userinfo`](https://developer.okta.com/docs/api/resources/oidc#userinfo) endpoint.

```javascript
await getUser();
```

##### Sample Response

If a user is available:

```javascript
{
  "sub": "00uid4BxXw6I6TV4m0g3",
  "name" :"John Doe",
  "nickname":"Jimmy",
  "given_name":"John",
  "middle_name":"James",
  "family_name":"Doe",
  "profile":"https://example.com/john.doe",
  "zoneinfo":"America/Los_Angeles",
  "locale":"en-US",
  "updated_at":1311280970,
  "email":"john.doe@example.com",
  "email_verified":true,
  "address" : { "street_address":"123 Hollywood Blvd.", "locality":"Los Angeles", "region":"CA", "postal_code":"90210", "country":"US" },
  "phone_number":"+1 (425) 555-1212"
}
```

### `getUserFromIdToken`

Returns the user claims decoded from the identity token.

```javascript
await getUserFromIdToken();
```

##### Sample Response

Sample user claims:

```javascript
{
  "sub": "00uid4BxXw6I6TV4m0g3", 
  "name": "John Doe", 
  "preferred_username": "john.doe@example.com"
  "ver": 1, 
  "iss": "https://dev-example.okta.com", 
  "aud": "00uid4BxXw6I6TV4m0g3",
  "auth_time": 1561679776,
  "exp": 1561683377,
  "iat": 1561679777,
  "idp": "00uid4BxXw6I6TV4m0g3"
}
```

### `revokeAccessToken`

Revoke the access token to make it inactive. Resolves `true` if access token has been successfully revoked.

```javascript
await revokeAccessToken();
```

### `revokeIdToken`

Revoke the identity token to make it inactive. Resolves `true` if id token has been successfully revoked.

```javascript
await revokeIdToken();
```

### `revokeRefreshToken`

Revoke the refresh token to make it inactive. Resolves `true` if refresh token has been successfully revoked.

```javascript
await revokeRefreshToken();
```

### `clearTokens`

Removes all tokens from local storage. Resolves `true` if tokens were successfully cleared.

```javascript
await clearTokens();
```

### `introspectAccessToken`

Introspect the access token. 

```javascript
await introspectAccessToken();
```

##### Sample Response

Sample responses can be found [here](https://developer.okta.com/docs/reference/api/oidc/#response-properties-3).

### `introspectIdToken`

Introspect the ID token. 

```javascript
await introspectIdToken();
```

##### Sample Response

Sample responses can be found [here](https://developer.okta.com/docs/reference/api/oidc/#response-properties-3).

### `introspectRefreshToken`

Introspect the id token. 

```javascript
await introspectRefreshToken();
```

##### Sample Response

Sample responses can be found [here](https://developer.okta.com/docs/reference/api/oidc/#response-properties-3).


### `refreshTokens`

Refreshes all tokens. Resolves with the refreshed tokens. 

```javascript
await refreshTokens();
```

##### Sample Response

```javascript
{ 
  "access_token": "{accessToken}", 
  "id_token": "{idToken}", 
  "refresh_token": "refreshToken" 
}
```

## Migrating between versions

### Migrating from 1.x to 2.x

`okta-react-native` `v2.0` has a few major changes in API.

- `signInWithBrowser` returns Promise.

**Note:** Events `signInSuccess`, `onError` are still triggered.

```javascript
signInWithBrowser().then(result => {
    // { resolve_type: 'authorized', access_token: 'token' }
  })
.catch(error => {
    // { code: '', message: '', detail: { message: '', status: '' } }
})
```
- `signOut` returns Promise.

**Note:** Events `signOutSuccess`, `onError` are still triggered.

```javascript
signOut().then(result => {
    // { resolve_type: 'signed_out' }
  })
.catch(error => {
    // { code: '', message: '', detail: { message: '', status: '' } }
    // Handle error
})
```

- The event `onCancelled` is triggered if a user cancels (closes) a embedded-browser window or tap the button `Cancel` (on iOS).
Additionally, `signInWithBrowser` and `signOut` throws the error: `{ code: '-1200', message: 'User cancelled a session' }`.

#### Troubleshooting

- `CocoaPods could not find compatible versions for pod "OktaOidc"`.

**Solution:** Navigate through Terminal to the folder `ios` and execute the command: `pod install —repo-update`.

## Contributing
We welcome contributions to all of our open-source packages. Please see the [contribution guide](https://github.com/okta/okta-react-native/blob/master/CONTRIBUTING.md) to understand how to structure a contribution.

### Installing dependencies for contributions
We use [yarn](https://yarnpkg.com) for dependency management when developing this package:
```
yarn install
```
