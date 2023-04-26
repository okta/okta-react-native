import { EnrollPasswordPayload, UpdatePasswordPayload, PasswordStatus } from '../types';
import BaseTransaction from './Base';
export default class PasswordTransaction extends BaseTransaction {
    id: string;
    created: string;
    lastUpdated: string;
    status: PasswordStatus;
    get?: () => Promise<PasswordTransaction>;
    enroll?: (payload: EnrollPasswordPayload) => Promise<PasswordTransaction>;
    update?: (payload: UpdatePasswordPayload) => Promise<PasswordTransaction>;
    delete?: () => Promise<BaseTransaction>;
    constructor(oktaAuth: any, options: any);
}
