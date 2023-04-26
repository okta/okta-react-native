import { StorageManagerInterface } from '../storage/types';
import { RequestData, RequestOptions, OktaAuthHttpInterface, OktaAuthHttpOptions } from '../http/types';
export interface AuthnTransactionLink {
    name?: string;
    type: string;
    href: string;
    hints?: {
        allow?: string[];
    };
}
export interface AuthnTransactionState {
    status: string;
    stateToken?: string;
    type?: string;
    expiresAt?: string;
    relayState?: string;
    factorResult?: string;
    factorType?: string;
    recoveryToken?: string;
    recoveryType?: string;
    autoPush?: boolean | (() => boolean);
    rememberDevice?: boolean | (() => boolean);
    profile?: {
        updatePhone?: boolean;
    };
    _links?: Record<string, AuthnTransactionLink>;
}
export declare type AuthnTransactionFunction = (obj?: any) => Promise<AuthnTransaction>;
export interface AuthnTransactionFunctions {
    next?: AuthnTransactionFunction;
    cancel?: AuthnTransactionFunction;
    skip?: AuthnTransactionFunction;
    unlock?: AuthnTransactionFunction;
    changePassword?: AuthnTransactionFunction;
    resetPassword?: AuthnTransactionFunction;
    answer?: AuthnTransactionFunction;
    recovery?: AuthnTransactionFunction;
    verify?: AuthnTransactionFunction;
    resend?: AuthnTransactionFunction;
    activate?: AuthnTransactionFunction;
    poll?: AuthnTransactionFunction;
    prev?: AuthnTransactionFunction;
}
export interface AuthnTransaction extends AuthnTransactionState, AuthnTransactionFunctions {
    sessionToken?: string;
    user?: Record<string, any>;
    factor?: Record<string, any>;
    factors?: Array<Record<string, any>>;
    policy?: Record<string, any>;
    scopes?: Array<Record<string, any>>;
    target?: Record<string, any>;
    authentication?: Record<string, any>;
}
export interface AuthnTransactionAPI {
    exists: () => boolean;
    status: (args?: object) => Promise<object>;
    resume: (args?: object) => Promise<AuthnTransaction>;
    introspect: (args?: object) => Promise<AuthnTransaction>;
    createTransaction: (res?: AuthnTransactionState) => AuthnTransaction;
    postToTransaction: (url: string, args?: RequestData, options?: RequestOptions) => Promise<AuthnTransaction>;
}
export interface SigninOptions {
    relayState?: string;
    context?: {
        deviceToken?: string;
    };
    sendFingerprint?: boolean;
    stateToken?: string;
    username?: string;
    password?: string;
}
export interface SigninWithCredentialsOptions extends SigninOptions {
    username: string;
    password: string;
}
export interface SigninAPI {
    signIn(opts: SigninOptions): Promise<AuthnTransaction>;
    signInWithCredentials(opts: SigninWithCredentialsOptions): Promise<AuthnTransaction>;
}
export interface ForgotPasswordOptions {
    username: string;
    factorType: 'SMS' | 'EMAIL' | 'CALL';
    relayState?: string;
}
export interface VerifyRecoveryTokenOptions {
    recoveryToken: string;
}
export interface AuthnAPI extends SigninAPI {
    forgotPassword(opts: any): Promise<AuthnTransaction>;
    unlockAccount(opts: ForgotPasswordOptions): Promise<AuthnTransaction>;
    verifyRecoveryToken(opts: VerifyRecoveryTokenOptions): Promise<AuthnTransaction>;
}
export interface FingerprintOptions {
    timeout?: number;
}
export declare type FingerprintAPI = (options?: FingerprintOptions) => Promise<string>;
export interface OktaAuthTxInterface<S extends StorageManagerInterface = StorageManagerInterface, O extends OktaAuthHttpOptions = OktaAuthHttpOptions> extends OktaAuthHttpInterface<S, O>, AuthnAPI {
    tx: AuthnTransactionAPI;
    authn: AuthnTransactionAPI;
    fingerprint: FingerprintAPI;
}
