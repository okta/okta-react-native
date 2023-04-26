import { OktaAuthIdxInterface, IdxContext, NextStep, Input } from '../../types';
import { Remediator } from '../Base/Remediator';
export declare class GenericRemediator extends Remediator {
    canRemediate(): boolean;
    getData(): {};
    getNextStep(authClient: OktaAuthIdxInterface, _context?: IdxContext): NextStep;
    getInputs(): Input[];
}
