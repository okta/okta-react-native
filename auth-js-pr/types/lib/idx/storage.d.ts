import { CookieOptions, StorageManagerOptions, StorageOptions, StorageUtil } from '../storage/types';
import { IdxTransactionMeta } from './types';
import { IdxResponseStorage } from './types/storage';
export declare function createIdxStorageManager<M extends IdxTransactionMeta>(): {
    new (storageManagerOptions: StorageManagerOptions, cookieOptions: CookieOptions, storageUtil: StorageUtil): {
        getIdxResponseStorage(options?: StorageOptions): IdxResponseStorage | null;
        getTransactionStorage(options?: StorageOptions | undefined): import("../oidc").TransactionStorage<M>;
        getSharedTansactionStorage(options?: StorageOptions | undefined): import("../oidc").TransactionStorage<M>;
        getOriginalUriStorage(options?: StorageOptions | undefined): import("../oidc").TransactionStorage<M>;
        storageManagerOptions: StorageManagerOptions;
        cookieOptions: CookieOptions;
        storageUtil: StorageUtil;
        getOptionsForSection(sectionName: string, overrideOptions?: StorageOptions | undefined): StorageOptions;
        getStorage(options: StorageOptions): import("../storage").SimpleStorage;
        getTokenStorage(options?: StorageOptions | undefined): import("../storage").StorageProvider;
        getHttpCache(options?: StorageOptions | undefined): import("../storage").StorageProvider;
    };
};
