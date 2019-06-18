"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base **Error** for **FireModel Plugin**. Takes _message_ and _type/subtype_ as
 * parameters. The code will be the `subtype`; the name is both.
 */
class FireModelPluginError extends Error {
    constructor(message, classification = "firemodel-plugin/error") {
        super(message);
        this.firemodel = true;
        const parts = classification.split("/");
        const [type, subType] = parts.length === 1 ? ["firemodel-plugin", parts[0]] : parts;
        this.name = `${type}/${subType}`;
        this.code = subType;
    }
}
exports.FireModelPluginError = FireModelPluginError;
//# sourceMappingURL=FiremodelPluginError.js.map