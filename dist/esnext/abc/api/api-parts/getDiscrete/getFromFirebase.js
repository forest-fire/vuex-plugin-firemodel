import { AbcResult } from "../..";
import { serverRecords } from "../../shared";
export async function getFromFirebase(ctx, local, options = {}, requestIds) {
    const server = await serverRecords(ctx, requestIds, requestIds);
    const serverResults = await AbcResult.create(ctx, {
        type: "discrete",
        local,
        server,
        options
    }, {});
    return { server, serverResults };
}
