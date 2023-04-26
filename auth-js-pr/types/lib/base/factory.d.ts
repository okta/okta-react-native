import { OktaAuthConstructor, OktaAuthBaseInterface, OktaAuthBaseOptions, OktaAuthOptionsConstructor } from './types';
export declare function createOktaAuthBase<O extends OktaAuthBaseOptions = OktaAuthBaseOptions>(OptionsConstructor: OktaAuthOptionsConstructor<O>): OktaAuthConstructor<OktaAuthBaseInterface<O>>;
