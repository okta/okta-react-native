import { OktaAuthOAuthInterface, OAuthResponse, TokenParams, TokenResponse, CustomUrls } from './types';
export declare function handleOAuthResponse(sdk: OktaAuthOAuthInterface, tokenParams: TokenParams, res: OAuthResponse, urls?: CustomUrls): Promise<TokenResponse>;
