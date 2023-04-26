import { IAPIFunction, BaseTransaction, EmailTransaction, EmailChallengeTransaction } from './types';
/**
 * @scope: okta.myAccount.email.read
 */
export declare const getEmails: IAPIFunction<EmailTransaction[]>;
/**
 * @scope: okta.myAccount.email.read
 */
export declare const getEmail: IAPIFunction<EmailTransaction>;
/**
 * @scope: okta.myAccount.email.manage
 */
export declare const addEmail: IAPIFunction<EmailTransaction>;
/**
 * @scope: okta.myAccount.email.manage
 */
export declare const deleteEmail: IAPIFunction<BaseTransaction>;
/**
 * @scope: okta.myAccount.email.read
 */
export declare const sendEmailChallenge: IAPIFunction<EmailChallengeTransaction>;
/**
 * @scope: okta.myAccount.email.read
 */
export declare const getEmailChallenge: IAPIFunction<EmailChallengeTransaction>;
/**
 * @scope: okta.myAccount.email.manage
 */
export declare const verifyEmailChallenge: IAPIFunction<BaseTransaction>;
