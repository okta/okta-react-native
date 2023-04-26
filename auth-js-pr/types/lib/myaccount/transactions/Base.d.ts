import { OktaAuthHttpInterface } from '../../http/types';
import { TransactionLink } from '../request';
declare type TransactionOptions = {
    res: {
        headers: Record<string, string>;
        _links?: Record<string, TransactionLink>;
        [property: string]: unknown;
    };
    accessToken: string;
};
export default class BaseTransaction {
    headers?: Record<string, string>;
    constructor(oktaAuth: OktaAuthHttpInterface, options: TransactionOptions);
}
export {};
