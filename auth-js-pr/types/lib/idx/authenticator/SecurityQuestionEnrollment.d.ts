import { Authenticator, Credentials } from './Authenticator';
export interface SecurityQuestionEnrollValues {
    questionKey?: string;
    question?: string;
    answer?: string;
    credentials?: Credentials;
}
export declare class SecurityQuestionEnrollment extends Authenticator<SecurityQuestionEnrollValues> {
    canVerify(values: SecurityQuestionEnrollValues): boolean;
    mapCredentials(values: SecurityQuestionEnrollValues): Credentials | undefined;
    getInputs(): ({
        name: string;
        type: string;
        required: boolean;
        label?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        required?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        required: boolean;
    })[];
}
