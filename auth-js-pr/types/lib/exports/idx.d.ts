import { OktaAuthIdxOptions } from '../idx';
declare const OktaAuthIdx: import("../idx").OktaAuthIdxConstructor<import("../idx").OktaAuthIdxInterface<import("../idx").IdxTransactionMeta, import("../idx").IdxStorageManagerInterface<import("../idx").IdxTransactionMeta>, OktaAuthIdxOptions, import("../idx").IdxTransactionManagerInterface> & import("./common").OktaAuthCoreInterface<import("../idx").IdxTransactionMeta, import("../idx").IdxStorageManagerInterface<import("../idx").IdxTransactionMeta>, OktaAuthIdxOptions, import("../idx").IdxTransactionManagerInterface>>;
export interface OktaAuthOptions extends OktaAuthIdxOptions {
}
declare class OktaAuth extends OktaAuthIdx {
    constructor(options: OktaAuthOptions);
}
export default OktaAuth;
export { OktaAuth };
export * from './common';
export * from '../idx';
