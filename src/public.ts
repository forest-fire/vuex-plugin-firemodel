// PROXY Firemodel through to consumers of this library
export * from "firemodel";

export * from "./types"
export * from "./auth/api"
export * from "./firemodelMutations"
export {abc, AbcApi} from "./abc"

export { FiremodelPlugin as default  } from './index'