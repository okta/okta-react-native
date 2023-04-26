import { OktaAuthOAuthInterface, Token } from './types';
export declare function renewToken(sdk: OktaAuthOAuthInterface, token: Token): Promise<Token | undefined>;
