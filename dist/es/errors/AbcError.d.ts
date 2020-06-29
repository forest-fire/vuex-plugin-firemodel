/**
 * An error within the Firemodel's Vuex plugin's **ABC** API. Takes _message_ and _type/subtype_ as
 * parameters. The code will be the `subtype`; the name is both.
 */
export declare class AbcError extends Error {
    firemodel: boolean;
    abc: boolean;
    code: string;
    constructor(message: string, classification?: string);
}
