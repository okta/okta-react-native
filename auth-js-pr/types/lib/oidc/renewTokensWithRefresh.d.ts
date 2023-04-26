import { OktaAuthOAuthInterface, TokenParams, RefreshToken, Tokens } from './types';
export declare function renewTokensWithRefresh(sdk: OktaAuthOAuthInterface, tokenParams: TokenParams, refreshTokenObject: RefreshToken): Promise<Tokens>;
