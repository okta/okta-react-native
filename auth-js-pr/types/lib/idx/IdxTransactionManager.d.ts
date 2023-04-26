import { ClearTransactionMetaOptions, TransactionManagerOptions } from '../oidc/types';
import { IdxTransactionMeta, IntrospectOptions } from './types';
import { IdxStorageManagerInterface, SavedIdxResponse } from './types/storage';
export declare function createIdxTransactionManager<M extends IdxTransactionMeta = IdxTransactionMeta, S extends IdxStorageManagerInterface<M> = IdxStorageManagerInterface<M>>(): {
    new (options: TransactionManagerOptions): {
        clear(options?: ClearTransactionMetaOptions): void;
        saveIdxResponse(data: SavedIdxResponse): void;
        loadIdxResponse(options?: IntrospectOptions): SavedIdxResponse | null;
        clearIdxResponse(): void;
        options: TransactionManagerOptions;
        storageManager: S;
        enableSharedStorage: boolean;
        saveLastResponse: boolean;
        save(meta: M, options?: import("../oidc/types").TransactionMetaOptions): void;
        exists(options?: import("../oidc/types").TransactionMetaOptions): boolean;
        load(options?: import("../oidc/types").TransactionMetaOptions): import("../oidc/types").TransactionMeta | null;
    };
};
