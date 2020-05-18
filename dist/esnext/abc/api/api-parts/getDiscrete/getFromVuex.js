import { getStore } from "../../../../index";
import get from "lodash.get";
export async function getFromVuex(ctx) {
    const store = getStore();
    const moduleIsList = ctx.about.config.isList;
    const data = get(store.state, ctx.vuex.fullPath.replace(/\//g, "."), []);
    return moduleIsList ? data : [data];
}
