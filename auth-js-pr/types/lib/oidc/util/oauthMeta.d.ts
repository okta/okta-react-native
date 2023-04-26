import { OAuthTransactionMeta, OktaAuthOAuthInterface, PKCETransactionMeta, TokenParams } from '../types';
export declare function createOAuthMeta(sdk: OktaAuthOAuthInterface, tokenParams: TokenParams): OAuthTransactionMeta | PKCETransactionMeta;
