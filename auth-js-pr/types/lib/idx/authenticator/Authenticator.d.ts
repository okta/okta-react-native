import { IdxAuthenticator, IdxRemediationValue } from '../types/idx-js';
export interface Credentials {
    [key: string]: string | undefined;
}
export declare abstract class Authenticator<Values> {
    meta: IdxAuthenticator;
    constructor(authenticator: IdxAuthenticator);
    abstract canVerify(values: Values): boolean;
    abstract mapCredentials(values: Values): Credentials | undefined;
    abstract getInputs(idxRemediationValue: IdxRemediationValue): any;
}
