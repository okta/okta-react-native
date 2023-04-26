import { IAPIFunction, BaseTransaction, PasswordTransaction } from './types';
/**
 * @scope: okta.myAccount.password.read
 */
export declare const getPassword: IAPIFunction<PasswordTransaction>;
/**
 * @scope: okta.myAccount.password.manage
 */
export declare const enrollPassword: IAPIFunction<PasswordTransaction>;
/**
 * @scope: okta.myAccount.password.manage
 */
export declare const updatePassword: IAPIFunction<PasswordTransaction>;
/**
 * @scope: okta.myAccount.password.manage
 */
export declare const deletePassword: IAPIFunction<BaseTransaction>;
