import { Authenticator, Credentials } from './Authenticator';
export interface WebauthnEnrollValues {
    clientData?: string;
    attestation?: string;
    credentials?: Credentials;
}
export declare class WebauthnEnrollment extends Authenticator<WebauthnEnrollValues> {
    canVerify(values: WebauthnEnrollValues): boolean;
    mapCredentials(values: WebauthnEnrollValues): Credentials | undefined;
    getInputs(): {
        name: string;
        type: string;
        required: boolean;
        visible: boolean;
        label: string;
    }[];
}
