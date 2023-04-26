import { EmailChallengeTransaction, EmailStatusTransaction } from '.';
import { EmailProfile, EmailRole, Status, VerificationPayload } from '../types';
import BaseTransaction from './Base';
export default class EmailTransaction extends BaseTransaction {
    id: string;
    profile: EmailProfile;
    roles: EmailRole[];
    status: Status;
    get: () => Promise<EmailTransaction>;
    delete: () => Promise<BaseTransaction>;
    challenge: () => Promise<EmailChallengeTransaction>;
    poll?: () => Promise<EmailStatusTransaction>;
    verify?: (payload: VerificationPayload) => Promise<BaseTransaction>;
    constructor(oktaAuth: any, options: any);
}
