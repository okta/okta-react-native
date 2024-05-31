import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { AuthenticationResponse, RefreshResponse } from './type';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  createConfig(
    options: Object,
    successCallback: (succeeded: boolean) => void,
    errorCallback: (
      errorCode: string,
      message: string,
      stackTrace: string
    ) => void
  ): void;
  signIn(options: Object): Promise<Object>;
  authenticate(sessionToken: string): Promise<AuthenticationResponse>;
  signOut(): Promise<Object>;
  getAccessToken(): Promise<Object>;
  getIdToken(): Promise<Object>;
  getUser(): Promise<Object>;
  isAuthenticated(): Promise<Object>;
  revokeAccessToken(): Promise<boolean>;
  revokeIdToken(): Promise<boolean>;
  revokeRefreshToken(): Promise<boolean>;
  introspectAccessToken(): Promise<Object>;
  introspectIdToken(): Promise<Object>;
  introspectRefreshToken(): Promise<Object>;
  refreshTokens(): Promise<RefreshResponse>;
  clearTokens(): Promise<boolean>;
  addListener(eventName: string): void;
  removeListeners(count: Int32): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('OktaReactNative');
