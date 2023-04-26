import { Authenticator, Credentials } from './Authenticator';
export interface WebauthnVerificationValues {
    clientData?: string;
    authenticatorData?: string;
    signatureData?: string;
    credentials?: Credentials;
}
export declare class WebauthnVerification extends Authenticator<WebauthnVerificationValues> {
    canVerify(values: WebauthnVerificationValues): boolean;
    mapCredentials(values: WebauthnVerificationValues): Credentials | undefined;
    getInputs(): {
        name: string;
        type: string;
        label: string;
        required: boolean;
        visible: boolean;
    }[];
}
