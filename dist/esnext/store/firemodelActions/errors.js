import { FmEvents } from "firemodel";
export const errors = () => ({
    async [FmEvents.UNEXPECTED_ERROR](_, payload) {
        console.warn(`An unexpected Firemodel error occurred`, payload);
    }
});
