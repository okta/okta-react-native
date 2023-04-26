import { OktaAuthConstructor } from '../base/types';
import { OAuthStorageManagerInterface, OAuthTransactionMeta, OktaAuthOAuthInterface, OktaAuthOAuthOptions, PKCETransactionMeta } from '../oidc/types';
import { OktaAuthMyAccountInterface } from './types';
export declare function mixinMyAccount<M extends OAuthTransactionMeta = PKCETransactionMeta, S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>, O extends OktaAuthOAuthOptions = OktaAuthOAuthOptions, TBase extends OktaAuthConstructor<OktaAuthOAuthInterface<M, S, O>> = OktaAuthConstructor<OktaAuthOAuthInterface<M, S, O>>>(Base: TBase): TBase & OktaAuthConstructor<OktaAuthMyAccountInterface<M, S, O>>;
