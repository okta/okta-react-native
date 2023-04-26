import { OktaAuthIdxInterface } from '../types';
import { IdxResponse, IdxToPersist, RawIdxResponse } from '../types/idx-js';
export declare const parsersForVersion: (version: any) => {
    makeIdxState: typeof import("./v1/makeIdxState").makeIdxState;
};
export declare function validateVersionConfig(version: any): void;
export declare function makeIdxState(authClient: OktaAuthIdxInterface, rawIdxResponse: RawIdxResponse, toPersist: IdxToPersist, requestDidSucceed: boolean): IdxResponse;
