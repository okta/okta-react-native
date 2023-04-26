import { OAuthStorageManagerInterface, OktaAuthOAuthInterface, OktaAuthOAuthOptions, PKCETransactionMeta, Tokens, TransactionManagerInterface } from '../../oidc/types';
import { ServiceManagerInterface, ServiceManagerOptions } from './Service';
import { AuthState, AuthStateManagerInterface } from './AuthState';
export interface OktaAuthCoreOptions extends OktaAuthOAuthOptions {
    services?: ServiceManagerOptions;
    transformAuthState?: (oktaAuth: OktaAuthCoreInterface, authState: AuthState) => Promise<AuthState>;
}
export declare type CoreStorageManagerInterface<M extends PKCETransactionMeta = PKCETransactionMeta> = OAuthStorageManagerInterface<M>;
export interface OktaAuthCoreInterface<M extends PKCETransactionMeta = PKCETransactionMeta, S extends CoreStorageManagerInterface<M> = CoreStorageManagerInterface<M>, O extends OktaAuthCoreOptions = OktaAuthCoreOptions, TM extends TransactionManagerInterface = TransactionManagerInterface> extends OktaAuthOAuthInterface<M, S, O, TM> {
    serviceManager: ServiceManagerInterface;
    authStateManager: AuthStateManagerInterface;
    start(): Promise<void>;
    stop(): Promise<void>;
    handleLoginRedirect(tokens?: Tokens, originalUri?: string): Promise<void>;
    handleRedirect(originalUri?: string): Promise<void>;
}
