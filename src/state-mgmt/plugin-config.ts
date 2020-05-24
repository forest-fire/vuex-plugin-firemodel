import { IFiremodelConfig } from "../private";

let _pluginConfig: IFiremodelConfig<any>;

export function storePluginConfig(config: IFiremodelConfig<any>) {
  _pluginConfig = config
}

export function getPluginConfig() {
  return _pluginConfig
}