import { CookieOptions, StorageManagerOptions, StorageOptions, StorageUtil } from '../storage/types';
import { TransactionStorage, OAuthTransactionMeta, PKCETransactionMeta } from './types';
export declare function createOAuthStorageManager<M extends OAuthTransactionMeta = PKCETransactionMeta>(): {
    new (storageManagerOptions: StorageManagerOptions, cookieOptions: CookieOptions, storageUtil: StorageUtil): {
        getTransactionStorage(options?: StorageOptions): TransactionStorage<M>;
        getSharedTansactionStorage(options?: StorageOptions): TransactionStorage<M>;
        getOriginalUriStorage(options?: StorageOptions): TransactionStorage<M>;
        storageManagerOptions: StorageManagerOptions;
        cookieOptions: CookieOptions;
        storageUtil: StorageUtil;
        getOptionsForSection(sectionName: string, overrideOptions?: StorageOptions | undefined): StorageOptions;
        getStorage(options: StorageOptions): import("../storage").SimpleStorage;
        getTokenStorage(options?: StorageOptions | undefined): import("../storage").StorageProvider;
        getHttpCache(options?: StorageOptions | undefined): import("../storage").StorageProvider;
    };
};
