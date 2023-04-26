import { CoreStorageManagerInterface, OktaAuthCoreOptions } from '../core';
export interface OktaAuthOptions extends OktaAuthCoreOptions {
}
declare const OktaAuthMyAccount: import("./common").OktaAuthConstructor<import("../myaccount").OktaAuthMyAccountInterface<import("./common").PKCETransactionMeta, CoreStorageManagerInterface<import("./common").PKCETransactionMeta>, OktaAuthOptions>>;
declare class OktaAuth extends OktaAuthMyAccount {
    constructor(options: OktaAuthOptions);
}
export default OktaAuth;
export { OktaAuth };
export * from './common';
export * from '../myaccount';
