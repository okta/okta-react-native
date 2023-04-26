import { OktaAuthConstructor } from '../base/types';
import { OktaAuthOAuthInterface } from '../oidc/types';
import { IdxTransactionManagerInterface, OktaAuthIdxInterface, OktaAuthIdxConstructor, OktaAuthIdxOptions } from './types';
import { IdxTransactionMeta } from './types/meta';
import { IdxStorageManagerInterface } from './types/storage';
export declare function mixinIdx<M extends IdxTransactionMeta = IdxTransactionMeta, S extends IdxStorageManagerInterface<M> = IdxStorageManagerInterface<M>, O extends OktaAuthIdxOptions = OktaAuthIdxOptions, TM extends IdxTransactionManagerInterface = IdxTransactionManagerInterface, TBase extends OktaAuthConstructor<OktaAuthOAuthInterface<M, S, O, TM>> = OktaAuthConstructor<OktaAuthOAuthInterface<M, S, O, TM>>>(Base: TBase): TBase & OktaAuthIdxConstructor<OktaAuthIdxInterface<M, S, O, TM>>;
