import { OAuthTransactionMeta, TransactionMetaOptions } from './meta';
import { TransactionManagerOptions, TransactionMeta } from './Transaction';
export interface ClearTransactionMetaOptions extends TransactionMetaOptions {
    clearSharedStorage?: boolean;
    clearIdxResponse?: boolean;
}
export interface TransactionManagerInterface {
    clear(options?: ClearTransactionMetaOptions): any;
    save(meta: OAuthTransactionMeta, options?: TransactionMetaOptions): any;
    exists(options?: TransactionMetaOptions): any;
    load(options?: TransactionMetaOptions): TransactionMeta | null;
}
export interface TransactionManagerConstructor<TM extends TransactionManagerInterface = TransactionManagerInterface> {
    new (options: TransactionManagerOptions): TM;
}
