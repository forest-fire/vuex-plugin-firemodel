import { RealTimeClient } from "universal-fire";
import { IClientConfig, IMockConfig } from "@forest-fire/types";
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export declare function database(config?: IClientConfig | IMockConfig): Promise<RealTimeClient>;
