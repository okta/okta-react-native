import { OktaAuthOAuthInterface, TokenParams } from '../types';
import { OktaAuthBaseInterface } from '../../base/types';
export declare function assertPKCESupport(sdk: OktaAuthBaseInterface): void;
export declare function validateCodeChallengeMethod(sdk: OktaAuthOAuthInterface, codeChallengeMethod?: string): Promise<string>;
export declare function preparePKCE(sdk: OktaAuthOAuthInterface, tokenParams: TokenParams): Promise<TokenParams>;
export declare function prepareTokenParams(sdk: OktaAuthOAuthInterface, tokenParams?: TokenParams): Promise<TokenParams>;
