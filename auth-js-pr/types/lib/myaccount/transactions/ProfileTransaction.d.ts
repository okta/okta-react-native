import BaseTransaction from './Base';
export default class ProfileTransaction extends BaseTransaction {
    createdAt: string;
    modifiedAt: string;
    profile: Record<string, string>;
    constructor(oktaAuth: any, options: any);
}
