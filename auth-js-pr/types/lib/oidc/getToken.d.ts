import { OktaAuthOAuthInterface, TokenParams, PopupParams } from './types';
export declare function getToken(sdk: OktaAuthOAuthInterface, options: TokenParams & PopupParams): Promise<import("./types").TokenResponse>;
