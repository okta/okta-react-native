import { OktaAuthHttpInterface, OktaAuthHttpOptions } from '../http/types';
import { OktaAuthConstructor } from '../base/types';
import { OktaAuthSessionInterface } from './types';
import { StorageManagerInterface } from '../storage/types';
export declare function mixinSession<S extends StorageManagerInterface = StorageManagerInterface, O extends OktaAuthHttpOptions = OktaAuthHttpOptions, TBase extends OktaAuthConstructor<OktaAuthHttpInterface<S, O>> = OktaAuthConstructor<OktaAuthHttpInterface<S, O>>>(Base: TBase): TBase & OktaAuthConstructor<OktaAuthSessionInterface<S, O>>;
