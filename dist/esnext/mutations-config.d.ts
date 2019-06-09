import { IFmEventActions } from './types';
import { MutationTree } from 'vuex';
import { ICompositeKey } from 'firemodel';
declare const mutations: MutationTree<any>;
export declare function generateLocalId(compositeKey: ICompositeKey, action: IFmEventActions): IFmEventActions;
declare const mutationTypes: string[];
export declare type IFmConfigMutationTypes = keyof typeof mutationTypes;
export default mutations;
