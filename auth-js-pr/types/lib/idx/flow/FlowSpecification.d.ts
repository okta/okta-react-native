import { OktaAuthIdxInterface, FlowIdentifier } from '../types';
import { RemediationFlow } from './RemediationFlow';
export interface FlowSpecification {
    flow: FlowIdentifier;
    remediators: RemediationFlow;
    actions?: string[];
    withCredentials?: boolean;
}
export declare function getFlowSpecification(oktaAuth: OktaAuthIdxInterface, flow?: FlowIdentifier): FlowSpecification;
