import { CoreStorageManagerInterface, OktaAuthCoreOptions } from '../core';
export interface OktaAuthOptions extends OktaAuthCoreOptions {
}
declare const WithAuthn: import("./common").OktaAuthConstructor<import("./common").OktaAuthCoreInterface<import("./common").PKCETransactionMeta, CoreStorageManagerInterface<import("./common").PKCETransactionMeta>, OktaAuthOptions, import("./common").TransactionManagerInterface>> & import("./common").OktaAuthConstructor<import("../authn").OktaAuthTxInterface<import("./common").StorageManagerInterface, import("./common").OktaAuthHttpOptions>>;
declare class OktaAuth extends WithAuthn {
    constructor(options: OktaAuthOptions);
}
export default OktaAuth;
export { OktaAuth };
export * from './common';
export * from '../authn';
