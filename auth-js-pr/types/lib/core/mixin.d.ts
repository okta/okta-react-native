import { OktaAuthConstructor } from '../base/types';
import { OAuthStorageManagerInterface, OAuthTransactionMeta, OktaAuthOAuthInterface, PKCETransactionMeta, TransactionManagerInterface } from '../oidc/types';
import { OktaAuthCoreInterface, OktaAuthCoreOptions } from './types';
export declare function mixinCore<M extends OAuthTransactionMeta = PKCETransactionMeta, S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>, O extends OktaAuthCoreOptions = OktaAuthCoreOptions, TM extends TransactionManagerInterface = TransactionManagerInterface, TBase extends OktaAuthConstructor<OktaAuthOAuthInterface<M, S, O, TM>> = OktaAuthConstructor<OktaAuthOAuthInterface<M, S, O, TM>>>(Base: TBase): TBase & OktaAuthConstructor<OktaAuthCoreInterface<M, S, O, TM>>;
