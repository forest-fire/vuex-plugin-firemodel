import { serverRecords } from "../../../../private";
export async function getFromFirebase(ctx, requestIds) {
    const server = await serverRecords(ctx, requestIds, requestIds);
    return server;
}
