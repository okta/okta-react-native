import { ChallengePhonePayload, PhoneProfile, Status, VerificationPayload } from '../types';
import BaseTransaction from './Base';
export default class PhoneTransaction extends BaseTransaction {
    id: string;
    profile: PhoneProfile;
    status: Status;
    get: () => Promise<PhoneTransaction>;
    delete: () => Promise<BaseTransaction>;
    challenge: (payload: ChallengePhonePayload) => Promise<BaseTransaction>;
    verify?: (payload: VerificationPayload) => Promise<BaseTransaction>;
    constructor(oktaAuth: any, options: any);
}
