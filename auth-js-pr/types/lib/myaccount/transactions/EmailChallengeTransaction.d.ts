import EmailStatusTransaction from './EmailStatusTransaction';
import { EmailProfile, Status, VerificationPayload } from '../types';
import BaseTransaction from './Base';
export default class EmailChallengeTransaction extends BaseTransaction {
    id: string;
    expiresAt: string;
    profile: EmailProfile;
    status: Status;
    poll: () => Promise<EmailStatusTransaction>;
    verify: (payload: VerificationPayload) => Promise<EmailChallengeTransaction>;
    constructor(oktaAuth: any, options: any);
}
