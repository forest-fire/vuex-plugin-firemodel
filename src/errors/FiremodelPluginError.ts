/**
 * Base **Error** for **FireModel Plugin**. Takes _message_ and _type/subtype_ as
 * parameters. The code will be the `subtype`; the name is both.
 */
export class FireModelPluginError extends Error {
  public firemodel = true;
  public code: string;
  constructor(message: string, classification = "firemodel-plugin/error") {
    super(message);
    const parts = classification.split("/");
    const [type, subType] =
      parts.length === 1 ? ["firemodel-plugin", parts[0]] : parts;
    this.name = `${type}/${subType}`;
    this.code = subType;
  }
}
