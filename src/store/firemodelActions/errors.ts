import { FmEvents } from "firemodel";

export const errors = <T>() => ({
  async [FmEvents.UNEXPECTED_ERROR](_: any, payload: any) {
    console.warn(`An unexpected Firemodel error occurred`, payload);
  }
});
