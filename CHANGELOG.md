# 2.3.0

### Bug Fix

- [#248](https://github.com/okta/okta-react-native/pull/248) Updates iOS OIDC dependency

# 2.2.0

### Bug Fix

- [#239](https://github.com/okta/okta-react-native/pull/239) Fixes exception from `onCancel` callback (Android)
- [#229](https://github.com/okta/okta-react-native/pull/229) Fixes memory warning 

### Other 

- [#240](https://github.com/okta/okta-react-native/pull/240) Updates transitive dependency on okta-oidc-android dependencies (Android) 
- [#232](https://github.com/okta/okta-react-native/pull/232) Updates React Native dependencies

# 2.1.2

### Bug Fix

- [#225](https://github.com/okta/okta-react-native/pull/225) Fixes TypeScript definitions for `getAuthClient`

# 2.1.1

### Bug Fix

- [#214](https://github.com/okta/okta-react-native/pull/214) Fixes signOut crash (Android)
- [#216](https://github.com/okta/okta-react-native/pull/216) Update okta-oidc-android to 1.1.0


# 2.1.0

### Bug Fix 

- [#194](https://github.com/okta/okta-react-native/pull/194) Replaces jwt library
- [#197](https://github.com/okta/okta-react-native/pull/197) Replaces clear method (iOS)
- [#199](https://github.com/okta/okta-react-native/pull/199) Fixes sign in results dispatch (Android)

### Other 
- OIDC ios dependencies update

# 2.0.0

### Breaking Changes

- [#155](https://github.com/okta/okta-react-native/pull/155) Changes `signOut`and `signInWithBrowser` methods signature to return a Promise (iOS)
- [#177](https://github.com/okta/okta-react-native/pull/177) Changes `signOut` and `signInWithBrowser` methods signature to return a Promise (Android)

Note: For more details, [follow migration guide](https://github.com/okta/okta-react-native/blob/master/README.md#migrating-between-versions).

# 1.13.3

### Bug Fix 

- [#211](https://github.com/okta/okta-react-native/pull/211) Backport Fixes sign in results dispatch (Android)

# 1.13.2

### Other 

- [#183](https://github.com/okta/okta-react-native/pull/183) Updates iOS OIDC dependency: fixes the error when it cannot install OktaOidc 3.10.5

# 1.13.1

### Other 

- Reverts breaking change

# 1.13.0

### Feature

- [#155](https://github.com/okta/okta-react-native/pull/155) Adds the promise for `signOut` method (iOS)
- [#177](https://github.com/okta/okta-react-native/pull/177) Adds the promise for `signOut` method (Android)

### Other

- [#151](https://github.com/okta/okta-react-native/pull/151) Updates android-oidc dependency
- [#178](https://github.com/okta/okta-react-native/pull/178) Updates `@okta/okta-auth-js` to version 5.3.1

# 1.12.1

### Bug Fix 

- [#158](https://github.com/okta/okta-react-native/pull/158) Fixes TS definition for `authenticate` method

# 1.12.0

### Feature

- [#147](https://github.com/okta/okta-react-native/pull/147) Accepts `oktaAuthConfig` in `createConfig` method to pass configuration for generating the `authClient`(OktaAuth instance).

### Bug Fix 

- [#144](https://github.com/okta/okta-react-native/pull/144) Fixes `noSSO` parameter in TS definition file

### Other 

- Dependencies upgrade 

# 1.11.1

### Bug Fix

- [#131](https://github.com/okta/okta-react-native/pull/131) Fixes iOS package linking

# 1.11.0

### Feature

- [#117](https://github.com/okta/okta-react-native/pull/117) Adds `noSSO` parameter on iOS

### Bug Fix

- [#107](https://github.com/okta/okta-react-native/pull/107) Fixes Android nonexistent activity obtainment

### Other 

- [#124](https://github.com/okta/okta-react-native/pull/124) Updates iOS OktaOidc dependency

# 1.10.0

### Bug Fix

- [#103](https://github.com/okta/okta-react-native/pull/103) Fixes hermes engine support

### Other

- [#96](https://github.com/okta/okta-react-native/pull/96) Updates okta-oidc-android dependency to 1.0.17

# 1.9.3

### Other

- [#94](https://github.com/okta/okta-react-native/pull/94) Fixes a build script to add support of file copying

# 1.9.2

### Other

- [#91](https://github.com/okta/okta-react-native/pull/91) Fixes "types" parameter in package.json

# 1.9.1

### Other

- [#82](https://github.com/okta/okta-react-native/pull/82) Fixes java import at BridgeModule
- [#84](https://github.com/okta/okta-react-native/pull/84) Adds `types/index.d.ts` into `files` array
- [#88](https://github.com/okta/okta-react-native/pull/88) Adds Swift version to podspec

# 1.9.0

### Features

- [#77](https://github.com/okta/okta-react-native/pull/77) Adds support for typescript

### Bug Fixes

- [#76](https://github.com/okta/okta-react-native/pull/76) Returns true for `isAuthenticated` only if both Access **and** ID Tokens are valid (ios)
- [#78](https://github.com/okta/okta-react-native/pull/78) Fixes npe for unauthorized token request
- [#79](https://github.com/okta/okta-react-native/pull/79) Returns true for `isAuthenticated` only if both Access **and** ID Tokens are valid (android)

### Other

- [#71](https://github.com/okta/okta-react-native/pull/71) Upgrades outdated dependencies

# 1.8.1

### Bug Fix

- [#66](https://github.com/okta/okta-react-native/pull/66) Rejects getAccessToken promise if expired

# 1.8.0

### Bug Fixes

- [#62](https://github.com/okta/okta-react-native/pull/62) Fixes getAccessToken promise rejection
- [#60](https://github.com/okta/okta-react-native/pull/60) Sanity check in introspecttoken
- [#57](https://github.com/okta/okta-react-native/pull/57) Fixes ios background thread exception

# 1.7.0

### Features

- [#26](https://github.com/okta/okta-react-native/pull/26) Adds transaction failure status when transaction status is not "SUCCESS" in [signIn](https://github.com/okta/okta-react-native#custom-sign-in)

# 1.6.0

### Features

- [#48](https://github.com/okta/okta-react-native/pull/48) Adds support for "idp" parameter on iOS

### Bug Fix

- [#46](https://github.com/okta/okta-react-native/pull/46) Fix a null pointer exception in OktaSdkBridgeModule#onActivityResult

# 1.5.0

### Features

- [#24](https://github.com/okta/okta-react-native/pull/24) Supports setting a Chrome tab color on Android
- [#29](https://github.com/okta/okta-react-native/pull/29) Adds support for HTTP timeouts on Android
- [#30](https://github.com/okta/okta-react-native/pull/30) Adds support for "idp" parameter on Android

### Other

- [#20](https://github.com/okta/okta-react-native/pull/20) Updates minimum Android SDK version to 21
# 1.4.4

### Bug Fix

- [#16](https://github.com/okta/okta-react-native/pull/16) Points to OIDC 3.9.2 (iOS)

# 1.4.3

- [#11](https://github.com/okta/okta-react-native/pull/12) Pins Cocoa Pod for iOS OIDC library to 3.8.0 because 3.9.0 introduces a conflict with Google AppAuth library

# 1.4.2

- [#10](https://github.com/okta/okta-react-native/pull/10) Upgrades [okta-oidc-android](https://github.com/okta/okta-oidc-android) dependency

# 1.4.1

### Bug fix

- [#790](https://github.com/okta/okta-oidc-js/pull/790) Pass consistent UA header in http request

# 1.4.0

### Features
- [#751](https://github.com/okta/okta-oidc-js/pull/751)
  - Support primary authentication flow
  - Add `getAuthClient` method to expose `@okta/okta-auth-js` client instance
  - Add `Promise` support for `authenticate` method

# 1.3.0

### Features
- [`f734054`](https://github.com/okta/okta-oidc-js/commit/f7340542b31495a9921e576349093305e9831b9d) - `clearTokens` will remove all tokens from local storage

# 1.2.3

### Bug Fix
- [`52bebbf`](https://github.com/okta/okta-oidc-js/commit/52bebbf21d668e729a6f674db2091380675df520) - Update Android OIDC dependency to 1.0.8

# 1.2.2

### Bug Fix
- [`05a3033`](https://github.com/okta/okta-oidc-js/commit/05a3033ba68e5e45170e3d50ce7dba535e3bccb5) - `refreshTokens` should save the new tokens (iOS)

# 1.2.1

### Bug fix
- [`05be754`](https://github.com/okta/okta-oidc-js/commit/05be7540a53e9c712cf108573451baa0124032f0) - Compilation error in Android bridge file

# 1.2.0

### Features
- [`58618c8`](https://github.com/okta/okta-oidc-js/commit/32b9a99e3065c34cdcc97018075697356403f11d) - Added `authenticate(withSessionToken:)` public method

# 1.1.0

### Features
- [`58618c8`](https://github.com/okta/okta-oidc-js/commit/58618c8a3f519c82a41f1cce58918bc98a459a2b) - Added support for React Native 0.60.x

# 1.0.2

### Features
- [`c422f1d`](https://github.com/okta/okta-oidc-js/commit/c422f1d064acaa26f994564ffb2fa5585a83c4be#diff-2c20101038faa8ceda1dda5c3cde79d8) - Add Carthage support

# 1.0.1

### Features
- [`138f068`](https://github.com/okta/okta-oidc-js/commit/138f068a64c62f754567919d79da2c67bbdb8969#diff-2c20101038faa8ceda1dda5c3cde79d8) - Make hardware backed key store configurable on android devices

### Other
- [`773bc9f`](https://github.com/okta/okta-oidc-js/commit/773bc9ff6bb2a440fb43439d17798224e57c0333#diff-2c20101038faa8ceda1dda5c3cde79d8) - Clears session client on android after user signs out

# 1.0.0

### Features
- [`e8948a8`](https://github.com/okta/okta-oidc-js/commit/e8948a83ce5b0f0213c96739760c219eda250598#diff-2c20101038faa8ceda1dda5c3cde79d8) - Reworks the React Native SDK. This major version upgrade removes Expo/Unimodules dependencies, replaces with Native Modules acting as wrappers around [okta-oidc-android](https://github.com/okta/okta-oidc-android) and [okta-oidc-ios](https://github.com/okta/okta-oidc-ios), and introduces new usages. For more details, refer to the commit.

# 0.1.2

### Other

- [`2945461`](https://github.com/okta/okta-oidc-js/pull/338/commits/294546166a41173b699579d7d647ba7d5cab0764) - Updates `@okta/configuration-validation` version

# 0.1.1

### Features

- [`1d214b4`](https://github.com/okta/okta-oidc-js/pull/320/commits/1d214b4ff5f51ad59a77cda64af3adfe69cb86ca) - Adds configuration validation for `issuer`, `client_id`, and `redirect_uri` when passed into the security component.

### Other

- [`c8b7ab5a`](https://github.com/okta/okta-oidc-js/commit/c8b7ab5aacecf5793efb6a626c0a24a78147ded9#diff-b8cfe5f7aa410fb30a335b09346dc4d2) - Migrate dependencies to project root utilizing [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).
- [`c26ffa0`](https://github.com/okta/okta-oidc-js/pull/239/commits/c26ffa05c6d98deb49a8bcc917b1196aae41487e) - Locks react-native dependency to `0.55`.
- [`e1eecba`](https://github.com/okta/okta-oidc-js/pull/219/commits/e1eecba3c484ba38d889e51e7c41b34ae9d6de63) - Callout [Expo](https://expo.io/) dependency.
