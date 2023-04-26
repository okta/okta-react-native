/*!
 * Copyright (c) 2021-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
import { APIError } from '../../errors/types';
import { OktaAuthOAuthInterface, Tokens, TransactionManagerConstructor, TransactionManagerInterface } from '../../oidc/types';
import { FlowIdentifier } from './FlowIdentifier';
import { IdxActions, IdxAuthenticator, IdxContext, IdxForm, IdxMessage, IdxOption, IdxRemediation, IdxResponse, RawIdxResponse, IdxActionParams, IdpConfig, IdxToPersist, ChallengeData, ActivationData } from './idx-js';
import { AccountUnlockOptions, AuthenticationOptions, CancelOptions, InteractOptions, IntrospectOptions, OktaAuthIdxOptions, PasswordRecoveryOptions, ProceedOptions, RegistrationOptions, StartOptions, IdxTransactionMetaOptions } from './options';
import { IdxTransactionMeta } from './meta';
import { IdxStorageManagerInterface, SavedIdxResponse } from './storage';
import type { WebauthnEnrollValues, WebauthnVerificationValues } from '../authenticator';
import { OktaAuthConstructor } from '../../base/types';
export declare enum IdxStatus {
    SUCCESS = "SUCCESS",
    PENDING = "PENDING",
    FAILURE = "FAILURE",
    TERMINAL = "TERMINAL",
    CANCELED = "CANCELED"
}
export declare enum AuthenticatorKey {
    OKTA_PASSWORD = "okta_password",
    OKTA_EMAIL = "okta_email",
    PHONE_NUMBER = "phone_number",
    GOOGLE_AUTHENTICATOR = "google_otp",
    SECURITY_QUESTION = "security_question",
    OKTA_VERIFY = "okta_verify",
    WEBAUTHN = "webauthn"
}
export declare type Input = {
    name: string;
    key?: string;
    type?: string;
    label?: string;
    value?: string | {
        form: IdxForm;
    } | Input[];
    minLength?: number;
    maxLength?: number;
    secret?: boolean;
    required?: boolean;
    options?: IdxOption[];
    mutable?: boolean;
    visible?: boolean;
};
export interface IdxPollOptions {
    required?: boolean;
    refresh?: number;
}
export declare type NextStep = {
    name: string;
    authenticator?: IdxAuthenticator;
    canSkip?: boolean;
    canResend?: boolean;
    inputs?: Input[];
    poll?: IdxPollOptions;
    authenticatorEnrollments?: IdxAuthenticator[];
    action?: (params?: IdxActionParams) => Promise<IdxTransaction>;
    idp?: IdpConfig;
    href?: string;
    relatesTo?: {
        type?: string;
        value: IdxAuthenticator;
    };
    refresh?: number;
};
export declare enum IdxFeature {
    PASSWORD_RECOVERY = "recover-password",
    REGISTRATION = "enroll-profile",
    SOCIAL_IDP = "redirect-idp",
    ACCOUNT_UNLOCK = "unlock-account"
}
export interface IdxTransaction {
    status: IdxStatus;
    tokens?: Tokens;
    nextStep?: NextStep;
    messages?: IdxMessage[];
    error?: APIError | IdxResponse;
    meta?: IdxTransactionMeta;
    enabledFeatures?: IdxFeature[];
    availableSteps?: NextStep[];
    requestDidSucceed?: boolean;
    stepUp?: boolean;
    proceed: (remediationName: string, params: unknown) => Promise<IdxResponse>;
    neededToProceed: IdxRemediation[];
    rawIdxState: RawIdxResponse;
    interactionCode?: string;
    actions: IdxActions;
    context: IdxContext;
}
export declare type Authenticator = {
    id?: string;
    key?: string;
    methodType?: string;
    phoneNumber?: string;
    channel?: string;
};
export declare function isAuthenticator(obj: any): obj is Authenticator;
export interface RemediationResponse {
    idxResponse: IdxResponse;
    nextStep?: NextStep;
    messages?: IdxMessage[];
    terminal?: boolean;
    canceled?: boolean;
}
export interface InteractResponse {
    state?: string;
    interactionHandle: string;
    meta: IdxTransactionMeta;
}
export interface EmailVerifyCallbackResponse {
    state: string;
    otp: string;
}
export interface IdxAPI {
    interact: (options?: InteractOptions) => Promise<InteractResponse>;
    introspect: (options?: IntrospectOptions) => Promise<IdxResponse>;
    makeIdxResponse: (rawIdxResponse: RawIdxResponse, toPersist: IdxToPersist, requestDidSucceed: boolean) => IdxResponse;
    authenticate: (options?: AuthenticationOptions) => Promise<IdxTransaction>;
    register: (options?: RegistrationOptions) => Promise<IdxTransaction>;
    recoverPassword: (options?: PasswordRecoveryOptions) => Promise<IdxTransaction>;
    unlockAccount: (options?: AccountUnlockOptions) => Promise<IdxTransaction>;
    poll: (options?: IdxPollOptions) => Promise<IdxTransaction>;
    start: (options?: StartOptions) => Promise<IdxTransaction>;
    canProceed(options?: ProceedOptions): boolean;
    proceed: (options?: ProceedOptions) => Promise<IdxTransaction>;
    cancel: (options?: CancelOptions) => Promise<IdxTransaction>;
    getFlow(): FlowIdentifier | undefined;
    setFlow(flow: FlowIdentifier): void;
    startTransaction: (options?: StartOptions) => Promise<IdxTransaction>;
    isInteractionRequired: (hashOrSearch?: string) => boolean;
    isInteractionRequiredError: (error: Error) => boolean;
    handleInteractionCodeRedirect: (url: string) => Promise<void>;
    isEmailVerifyCallback: (search: string) => boolean;
    parseEmailVerifyCallback: (search: string) => EmailVerifyCallbackResponse;
    handleEmailVerifyCallback: (search: string) => Promise<IdxTransaction | undefined>;
    isEmailVerifyCallbackError: (error: Error) => boolean;
    getSavedTransactionMeta: (options?: IdxTransactionMetaOptions) => IdxTransactionMeta | undefined;
    createTransactionMeta: (options?: IdxTransactionMetaOptions) => Promise<IdxTransactionMeta>;
    getTransactionMeta: (options?: IdxTransactionMetaOptions) => Promise<IdxTransactionMeta>;
    saveTransactionMeta: (meta: unknown) => void;
    clearTransactionMeta: () => void;
    isTransactionMetaValid: (meta: unknown) => boolean;
}
export interface IdxTransactionManagerInterface extends TransactionManagerInterface {
    saveIdxResponse(data: SavedIdxResponse): void;
    loadIdxResponse(options?: IntrospectOptions): SavedIdxResponse | null;
    clearIdxResponse(): void;
}
export declare type IdxTransactionManagerConstructor = TransactionManagerConstructor<IdxTransactionManagerInterface>;
export interface WebauthnAPI {
    getAssertion(credential: PublicKeyCredential): WebauthnVerificationValues;
    getAttestation(credential: PublicKeyCredential): WebauthnEnrollValues;
    buildCredentialRequestOptions(challengeData: ChallengeData, authenticatorEnrollments: IdxAuthenticator[]): CredentialRequestOptions;
    buildCredentialCreationOptions(activationData: ActivationData, authenticatorEnrollments: IdxAuthenticator[]): CredentialCreationOptions;
}
export interface OktaAuthIdxInterface<M extends IdxTransactionMeta = IdxTransactionMeta, S extends IdxStorageManagerInterface<M> = IdxStorageManagerInterface<M>, O extends OktaAuthIdxOptions = OktaAuthIdxOptions, TM extends IdxTransactionManagerInterface = IdxTransactionManagerInterface> extends OktaAuthOAuthInterface<M, S, O, TM> {
    idx: IdxAPI;
}
export interface OktaAuthIdxConstructor<I extends OktaAuthIdxInterface = OktaAuthIdxInterface> extends OktaAuthConstructor<I> {
    new (...args: any[]): I;
    webauthn: WebauthnAPI;
}
