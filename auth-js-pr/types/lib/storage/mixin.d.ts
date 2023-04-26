import { OktaAuthBaseInterface, OktaAuthConstructor } from '../base/types';
import { OktaAuthStorageInterface, OktaAuthStorageOptions, StorageManagerConstructor, StorageManagerInterface } from './types';
export declare function mixinStorage<S extends StorageManagerInterface = StorageManagerInterface, O extends OktaAuthStorageOptions = OktaAuthStorageOptions, TBase extends OktaAuthConstructor<OktaAuthBaseInterface<O>> = OktaAuthConstructor<OktaAuthBaseInterface<O>>>(Base: TBase, StorageManager: StorageManagerConstructor<S>): TBase & OktaAuthConstructor<OktaAuthStorageInterface<S, O>>;
