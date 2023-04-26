import { OktaAuthIdxOptions } from '../idx';
export interface OktaAuthOptions extends OktaAuthIdxOptions {
}
declare const WithAuthn: import("../idx").OktaAuthIdxConstructor<import("../idx").OktaAuthIdxInterface<import("../idx").IdxTransactionMeta, import("../idx").IdxStorageManagerInterface<import("../idx").IdxTransactionMeta>, OktaAuthOptions, import("../idx").IdxTransactionManagerInterface> & import("./common").OktaAuthCoreInterface<import("../idx").IdxTransactionMeta, import("../idx").IdxStorageManagerInterface<import("../idx").IdxTransactionMeta>, OktaAuthOptions, import("../idx").IdxTransactionManagerInterface>> & import("./common").OktaAuthConstructor<import("../myaccount").OktaAuthMyAccountInterface<import("./common").PKCETransactionMeta, import("./common").OAuthStorageManagerInterface<import("./common").PKCETransactionMeta>, import("./common").OktaAuthOAuthOptions>> & import("./common").OktaAuthConstructor<import("../authn").OktaAuthTxInterface<import("./common").StorageManagerInterface, import("./common").OktaAuthHttpOptions>>;
declare class OktaAuth extends WithAuthn {
    constructor(options: OktaAuthOptions);
}
export default OktaAuth;
export { OktaAuth };
export * from './common';
export * from '../idx';
export * from '../myaccount';
export * from '../authn';
