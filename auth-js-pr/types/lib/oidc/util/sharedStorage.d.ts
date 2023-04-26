import { OAuthStorageManagerInterface, OAuthTransactionMeta } from '../types';
export declare function pruneSharedStorage<M extends OAuthTransactionMeta>(storageManager: OAuthStorageManagerInterface<M>): void;
export declare function saveTransactionToSharedStorage<M extends OAuthTransactionMeta>(storageManager: OAuthStorageManagerInterface<M>, state: string, meta: M): void;
export declare function loadTransactionFromSharedStorage<M extends OAuthTransactionMeta>(storageManager: OAuthStorageManagerInterface<M>, state: string): any;
export declare function clearTransactionFromSharedStorage<M extends OAuthTransactionMeta>(storageManager: OAuthStorageManagerInterface<M>, state: string): void;
