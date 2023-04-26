import { Authenticator, Credentials } from './Authenticator';
export interface VerificationCodeValues {
    verificationCode?: string;
    otp?: string;
    credentials?: Credentials;
}
interface VerificationCodeCredentials extends Credentials {
    passcode: string;
}
export declare class VerificationCodeAuthenticator extends Authenticator<VerificationCodeValues> {
    canVerify(values: VerificationCodeValues): boolean;
    mapCredentials(values: any): VerificationCodeCredentials | Credentials | undefined;
    getInputs(idxRemediationValue: any): any;
}
export {};
