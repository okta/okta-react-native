import BaseTransaction from './Base';
export default class ProfileSchemaTransaction extends BaseTransaction {
    properties: Record<string, object>;
    constructor(oktaAuth: any, options: any);
}
