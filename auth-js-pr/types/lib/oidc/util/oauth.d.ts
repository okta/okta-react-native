import { OktaAuthOAuthInterface, CustomUrls } from '../types';
export declare function generateState(): string;
export declare function generateNonce(): string;
export declare function getOAuthBaseUrl(sdk: OktaAuthOAuthInterface, options?: CustomUrls): any;
export declare function getOAuthDomain(sdk: OktaAuthOAuthInterface, options?: CustomUrls): any;
export declare function getOAuthUrls(sdk: OktaAuthOAuthInterface, options?: CustomUrls): CustomUrls;
