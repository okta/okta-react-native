import { OktaAuthOAuthInterface, TokenParams, TokenResponse } from './types';
export declare function getWithoutPrompt(sdk: OktaAuthOAuthInterface, options: TokenParams): Promise<TokenResponse>;
