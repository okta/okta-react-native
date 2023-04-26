import { Authenticator, Credentials } from './Authenticator';
export interface OktaPasswordInputValues {
    password?: string;
    passcode?: string;
    credentials?: Credentials;
}
export declare class OktaPassword extends Authenticator<OktaPasswordInputValues> {
    canVerify(values: OktaPasswordInputValues): boolean;
    mapCredentials(values: OktaPasswordInputValues): Credentials | undefined;
    getInputs(idxRemediationValue: any): any;
}
