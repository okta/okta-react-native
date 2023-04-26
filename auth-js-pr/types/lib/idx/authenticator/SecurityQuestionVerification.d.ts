import { Authenticator, Credentials } from './Authenticator';
export interface SecurityQuestionVerificationValues {
    answer?: string;
    credentials?: Credentials;
}
export declare class SecurityQuestionVerification extends Authenticator<SecurityQuestionVerificationValues> {
    canVerify(values: SecurityQuestionVerificationValues): boolean;
    mapCredentials(values: SecurityQuestionVerificationValues): Credentials | undefined;
    getInputs(): {
        name: string;
        type: string;
        label: string;
        required: boolean;
    }[];
}
