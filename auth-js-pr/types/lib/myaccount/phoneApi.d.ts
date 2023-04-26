import { IAPIFunction, BaseTransaction, PhoneTransaction } from './types';
/**
 * @scope: okta.myAccount.phone.read
 */
export declare const getPhones: IAPIFunction<PhoneTransaction[]>;
/**
 * @scope: okta.myAccount.phone.read
 */
export declare const getPhone: IAPIFunction<PhoneTransaction>;
/**
 * @scope: okta.myAccount.phone.manage
 */
export declare const addPhone: IAPIFunction<PhoneTransaction>;
/**
 * @scope: okta.myAccount.phone.manage
 */
export declare const deletePhone: IAPIFunction<BaseTransaction>;
/**
 * @scope: okta.myAccount.phone.manage
 */
export declare const sendPhoneChallenge: IAPIFunction<BaseTransaction>;
/**
 * @scope: okta.myAccount.phone.manage
 */
export declare const verifyPhoneChallenge: IAPIFunction<BaseTransaction>;
