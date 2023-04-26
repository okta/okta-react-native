import { BaseTransaction } from './transactions';
import { MyAccountRequestOptions as RequestOptions } from './types';
import { OktaAuthOAuthInterface } from '../oidc/types';
export declare type TransactionLink = {
    href: string;
    hints?: {
        allow?: string[];
    };
};
declare type TransactionLinks = {
    self: TransactionLink;
    [property: string]: TransactionLink;
};
declare type SendRequestOptions = RequestOptions & {
    url: string;
    method: string;
    transactionClassName?: string;
};
export declare function sendRequest<T extends BaseTransaction>(oktaAuth: OktaAuthOAuthInterface, options: SendRequestOptions): Promise<T | T[]>;
export declare type GenerateRequestFnFromLinksOptions = {
    oktaAuth: OktaAuthOAuthInterface;
    accessToken: string;
    methodName: string;
    links: TransactionLinks;
    transactionClassName?: string;
};
declare type IRequestFnFromLinks = <T extends BaseTransaction>(payload?: any) => Promise<T | T[]>;
export declare function generateRequestFnFromLinks({ oktaAuth, accessToken, methodName, links, transactionClassName }: GenerateRequestFnFromLinksOptions): IRequestFnFromLinks;
export {};
