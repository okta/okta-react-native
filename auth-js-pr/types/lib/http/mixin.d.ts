import { OktaAuthStorageInterface, StorageManagerInterface } from '../storage/types';
import { OktaAuthConstructor } from '../base/types';
import { OktaAuthHttpInterface, OktaAuthHttpOptions } from './types';
export declare function mixinHttp<S extends StorageManagerInterface = StorageManagerInterface, O extends OktaAuthHttpOptions = OktaAuthHttpOptions, TBase extends OktaAuthConstructor<OktaAuthStorageInterface<S, O>> = OktaAuthConstructor<OktaAuthStorageInterface<S, O>>>(Base: TBase): TBase & OktaAuthConstructor<OktaAuthHttpInterface<S, O>>;
