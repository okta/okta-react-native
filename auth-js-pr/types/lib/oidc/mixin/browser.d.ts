import { OktaAuthStorageInterface } from '../../storage';
import { OktaAuthConstructor } from '../../base';
import { OAuthStorageManagerInterface, OAuthTransactionMeta, OktaAuthOAuthOptions, PKCETransactionMeta } from '../types';
export declare function provideOriginalUri<M extends OAuthTransactionMeta = PKCETransactionMeta, S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>, O extends OktaAuthOAuthOptions = OktaAuthOAuthOptions, TBase extends OktaAuthConstructor<OktaAuthStorageInterface<S, O>> = OktaAuthConstructor<OktaAuthStorageInterface<S, O>>>(BaseClass: TBase): {
    new (...args: any[]): {
        setOriginalUri(originalUri: string, state?: string): void;
        getOriginalUri(state?: string): string | undefined;
        removeOriginalUri(state?: string): void;
        storageManager: S;
        clearStorage(): void;
        options: O;
        emitter: import("../../base").EventEmitter;
        features: import("../../base").FeaturesAPI;
    };
    features: import("../../base").FeaturesAPI;
    constants: typeof import("../../constants");
} & TBase;
