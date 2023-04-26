import { AccessToken, IDToken, UserClaims, CustomUserClaims } from './types';
export declare function getUserInfo<T extends CustomUserClaims = CustomUserClaims>(sdk: any, accessTokenObject: AccessToken, idTokenObject: IDToken): Promise<UserClaims<T>>;
