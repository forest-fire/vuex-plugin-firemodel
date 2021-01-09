/**
 * An error within the Firemodel's Vuex plugin's **ABC** API. Takes _message_ and _type/subtype_ as
 * parameters. The code will be the `subtype`; the name is both.
 */
export class AbcError extends Error {
  public firemodel = true;
  public abc = true;
  public code: string;
  constructor(message: string, classification = "abc-api/error") {
    super(message);
    const parts = classification.split("/");
    const [type, subType] = parts.length === 1 ? ["abc-api", parts[0]] : parts;
    this.name = `${type}/${subType}`;
    this.code = subType;
  }
}
