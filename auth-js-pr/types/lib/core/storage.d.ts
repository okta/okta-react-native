import { PKCETransactionMeta } from '../oidc/types';
export declare function createCoreStorageManager<M extends PKCETransactionMeta = PKCETransactionMeta>(): {
    new (storageManagerOptions: import("../storage").StorageManagerOptions, cookieOptions: import("../storage").CookieOptions, storageUtil: import("../storage").StorageUtil): {
        getTransactionStorage(options?: import("../storage").StorageOptions | undefined): import("../oidc/types").TransactionStorage<M>;
        getSharedTansactionStorage(options?: import("../storage").StorageOptions | undefined): import("../oidc/types").TransactionStorage<M>;
        getOriginalUriStorage(options?: import("../storage").StorageOptions | undefined): import("../oidc/types").TransactionStorage<M>;
        storageManagerOptions: import("../storage").StorageManagerOptions;
        cookieOptions: import("../storage").CookieOptions;
        storageUtil: import("../storage").StorageUtil;
        getOptionsForSection(sectionName: string, overrideOptions?: import("../storage").StorageOptions | undefined): import("../storage").StorageOptions;
        getStorage(options: import("../storage").StorageOptions): import("../storage").SimpleStorage;
        getTokenStorage(options?: import("../storage").StorageOptions | undefined): import("../storage").StorageProvider;
        getHttpCache(options?: import("../storage").StorageOptions | undefined): import("../storage").StorageProvider;
    };
};
