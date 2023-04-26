import { IAPIFunction, ProfileTransaction, ProfileSchemaTransaction } from './types';
/**
 * @scope: okta.myAccount.profile.read
 */
export declare const getProfile: IAPIFunction<ProfileTransaction>;
/**
 * @scope: okta.myAccount.profile.manage
 */
export declare const updateProfile: IAPIFunction<ProfileTransaction>;
/**
 * @scope: okta.myAccount.profile.read
 */
export declare const getProfileSchema: IAPIFunction<ProfileSchemaTransaction>;
