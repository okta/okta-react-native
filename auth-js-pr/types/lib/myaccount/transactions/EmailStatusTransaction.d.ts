import { EmailProfile, Status } from '../types';
import BaseTransaction from './Base';
export default class EmailStatusTransaction extends BaseTransaction {
    id: string;
    expiresAt: string;
    profile: EmailProfile;
    status: Status;
    constructor(oktaAuth: any, options: any);
}
