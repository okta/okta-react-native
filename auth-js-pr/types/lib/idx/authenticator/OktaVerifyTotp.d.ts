import { Credentials } from './Authenticator';
import { VerificationCodeAuthenticator } from './VerificationCodeAuthenticator';
interface TotpCredentials extends Credentials {
    totp: string;
}
export declare class OktaVerifyTotp extends VerificationCodeAuthenticator {
    mapCredentials(values: any): TotpCredentials | undefined;
}
export {};
