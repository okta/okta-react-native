import { OAuthStorageManagerInterface, OAuthTransactionMeta, OktaAuthOAuthInterface, OktaAuthOAuthOptions, PKCETransactionMeta } from '../oidc/types';
export { EmailTransaction, EmailStatusTransaction, EmailChallengeTransaction, PhoneTransaction, ProfileTransaction, ProfileSchemaTransaction, PasswordTransaction, BaseTransaction } from './transactions';
export declare enum EmailRole {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY"
}
export declare enum Status {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED"
}
export declare enum PasswordStatus {
    NOT_ENROLLED = "NOT_ENROLLED",
    ACTIVE = "ACTIVE"
}
export declare type EmailProfile = {
    email: string;
};
export declare type AddEmailPayload = {
    profile: {
        email: string;
    };
    sendEmail: boolean;
    role: EmailRole;
};
export declare type PhoneProfile = {
    profile: {
        phoneNumber: string;
    };
};
export declare type AddPhonePayload = {
    profile: {
        phoneNumber: string;
    };
    sendCode: boolean;
    method: string;
};
export declare type ChallengePhonePayload = {
    method: string;
};
export declare type VerificationPayload = {
    verificationCode: string;
};
export declare type EnrollPasswordPayload = {
    profile: {
        password: string;
    };
};
export declare type UpdatePasswordPayload = {
    profile: {
        password: string;
        currentPassword?: string;
    };
};
export declare type UpdateProfilePayload = {
    profile: {
        firstName?: string;
        lastName?: string;
        email?: string;
        login?: string;
        [property: string]: any;
    };
};
export declare type MyAccountRequestOptions = {
    id?: string;
    emailId?: string;
    challengeId?: string;
    payload?: AddEmailPayload | AddPhonePayload | ChallengePhonePayload | VerificationPayload | UpdateProfilePayload | EnrollPasswordPayload | UpdatePasswordPayload;
    accessToken?: string;
};
export declare type IAPIFunction<T> = (oktaAuth: OktaAuthOAuthInterface, options?: MyAccountRequestOptions) => Promise<T>;
export interface OktaAuthMyAccountInterface<M extends OAuthTransactionMeta = PKCETransactionMeta, S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>, O extends OktaAuthOAuthOptions = OktaAuthOAuthOptions> extends OktaAuthOAuthInterface<M, S, O> {
    myaccount: any;
}
