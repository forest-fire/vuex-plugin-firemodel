import { AbcApi, getStore } from "../../../../private"

import {get} from "../../../../util/index";

export async function getFromVuex<T>(ctx: AbcApi<T>) {
  const store = getStore();
  const moduleIsList = ctx.about.config.isList as boolean;

  const data = get(
    store.state,
    ctx.vuex.fullPath.replace(/\//g, "."),
    []
  )

  return moduleIsList ? data : [data];
}