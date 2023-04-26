import { StorageManagerConstructor } from '../storage/types';
import { OktaAuthConstructor, OktaAuthOptionsConstructor } from '../base/types';
import { OAuthStorageManagerInterface, PKCETransactionMeta, TransactionManagerConstructor, TransactionManagerInterface } from '../oidc/types';
import { OktaAuthCoreOptions } from '../core/types';
import { OktaAuthMyAccountInterface } from './types';
export declare function createOktaAuthMyAccount<M extends PKCETransactionMeta = PKCETransactionMeta, S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>, O extends OktaAuthCoreOptions = OktaAuthCoreOptions, TM extends TransactionManagerInterface = TransactionManagerInterface>(StorageManagerConstructor: StorageManagerConstructor<S>, OptionsConstructor: OktaAuthOptionsConstructor<O>, TransactionManager: TransactionManagerConstructor<TM>): OktaAuthConstructor<OktaAuthMyAccountInterface<M, S, O>>;
