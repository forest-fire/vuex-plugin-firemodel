import StackTrace from "stacktrace-js";
/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
export async function runQueue(ctx, lifecycle) {
    const remainingQueueItems = [];
    const queued = ctx.state["@firemodel"].queued.filter(i => i.on === lifecycle);
    let errors = 0;
    let successes = 0;
    for (const item of queued) {
        try {
            await item.cb(ctx);
            successes++;
        }
        catch (e) {
            errors++;
            try {
                let originPoint = '';
                const frames = await StackTrace.fromError(e, { offline: true });
                const stack = await frames
                    .map(i => { var _a; return ` - ${(_a = i.fileName) === null || _a === void 0 ? void 0 : _a.replace('webpack-internal:///', '')}:${i.functionName}(${i.args ? " " + i.args.join(', ') + " " : ''}) at line ${i.lineNumber}, col ${i.columnNumber}`; })
                    .join("\n");
                console.error(`deQueing ${item.name}: ${e.message}.\n\nThe stacktrace is:\n${stack}`);
            }
            catch (se) {
                console.error(`deQueing ${item.name}: ${e.message}.\n\nThe callback which being called when the error occurred starts like this: ${item.cb ? item.cb.toString().slice(0, 50) : "undefined callback"}`);
            }
            ctx.commit("error", {
                message: e.message,
                code: e.code || e.name,
                stack: e.stack
            });
            remainingQueueItems.push(Object.assign(Object.assign({}, item), { error: e.message, errorStack: e.stack }));
        }
    }
    if (errors > 0) {
        console.warn(`- while running the ${lifecycle} event, ${errors} errors were encountered [ ${successes} successful ]; errors will be listed in the @firemodel state tree.`);
    }
    ctx.commit("LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */, {
        event: lifecycle,
        actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
    });
}
