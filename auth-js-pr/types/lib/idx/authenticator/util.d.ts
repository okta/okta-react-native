import { Authenticator } from '../types';
export declare function formatAuthenticator(incoming: unknown): Authenticator;
export declare function compareAuthenticators(auth1: any, auth2: any): boolean;
export declare function findMatchedOption(authenticators: any, options: any): any;
