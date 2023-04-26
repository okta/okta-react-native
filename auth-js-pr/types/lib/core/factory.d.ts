import { StorageManagerConstructor } from '../storage/types';
import { OktaAuthConstructor, OktaAuthOptionsConstructor } from '../base/types';
import { OktaAuthCoreInterface, OktaAuthCoreOptions } from './types';
import { OAuthStorageManagerInterface, PKCETransactionMeta, TransactionManagerConstructor, TransactionManagerInterface } from '../oidc/types';
export declare function createOktaAuthCore<M extends PKCETransactionMeta = PKCETransactionMeta, S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>, O extends OktaAuthCoreOptions = OktaAuthCoreOptions, TM extends TransactionManagerInterface = TransactionManagerInterface>(StorageManagerConstructor: StorageManagerConstructor<S>, OptionsConstructor: OktaAuthOptionsConstructor<O>, TransactionManagerConstructor: TransactionManagerConstructor<TM>): OktaAuthConstructor<OktaAuthCoreInterface<M, S, O, TM>>;
