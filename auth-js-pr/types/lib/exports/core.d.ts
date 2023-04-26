import { CoreStorageManagerInterface, OktaAuthCoreOptions } from '../core';
export interface OktaAuthOptions extends OktaAuthCoreOptions {
}
declare const OktaAuthCore: import("./common").OktaAuthConstructor<import("./common").OktaAuthCoreInterface<import("./common").PKCETransactionMeta, CoreStorageManagerInterface<import("./common").PKCETransactionMeta>, OktaAuthOptions, import("./common").TransactionManagerInterface>>;
declare class OktaAuth extends OktaAuthCore {
    constructor(options: OktaAuthOptions);
}
export default OktaAuth;
export { OktaAuth };
export * from './common';
