import { ParseFromUrlOptions, TokenResponse, OAuthResponse } from './types';
export declare function getResponseMode(sdk: any): 'query' | 'fragment';
export declare function parseOAuthResponseFromUrl(sdk: any, options: string | ParseFromUrlOptions): OAuthResponse;
export declare function cleanOAuthResponseFromUrl(sdk: any, options: ParseFromUrlOptions): void;
export declare function parseFromUrl(sdk: any, options?: string | ParseFromUrlOptions): Promise<TokenResponse>;
