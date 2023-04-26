import { IDToken, OktaAuthOAuthInterface, TokenVerifyParams } from '../oidc/types';
export declare function verifyToken(sdk: OktaAuthOAuthInterface, token: IDToken, validationParams: TokenVerifyParams): Promise<IDToken>;
