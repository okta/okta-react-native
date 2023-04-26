import { OktaAuthOAuthInterface, WellKnownResponse } from '../types';
export declare function getWellKnown(sdk: OktaAuthOAuthInterface, issuer?: string): Promise<WellKnownResponse>;
export declare function getKey(sdk: OktaAuthOAuthInterface, issuer: string, kid: string): Promise<string>;
