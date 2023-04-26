import { OktaAuthOptionsConstructor } from '../../base/types';
import { StorageManagerConstructor } from '../../storage/types';
import { IdxTransactionManagerInterface, OktaAuthIdxInterface, OktaAuthIdxConstructor } from '../types/api';
import { IdxTransactionMeta } from '../types/meta';
import { IdxStorageManagerInterface } from '../types/storage';
import { OktaAuthIdxOptions } from '../types/options';
import { TransactionManagerConstructor } from '../../oidc/types';
import { OktaAuthCoreInterface } from '../../core/types';
export declare function createOktaAuthIdx<M extends IdxTransactionMeta = IdxTransactionMeta, S extends IdxStorageManagerInterface<M> = IdxStorageManagerInterface<M>, O extends OktaAuthIdxOptions = OktaAuthIdxOptions, TM extends IdxTransactionManagerInterface = IdxTransactionManagerInterface>(StorageManagerConstructor: StorageManagerConstructor<S>, OptionsConstructor: OktaAuthOptionsConstructor<O>, TransactionManagerConstructor: TransactionManagerConstructor<TM>): OktaAuthIdxConstructor<OktaAuthIdxInterface<M, S, O, TM> & OktaAuthCoreInterface<M, S, O, TM>>;
