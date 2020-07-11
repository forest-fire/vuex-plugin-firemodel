import Cookies from "js-cookie";
import { SINCE_LAST_COOKIE } from "@/types";

function get() {
  return JSON.parse(Cookies.get(SINCE_LAST_COOKIE) || "{}") || {};
}

export function getCookie(modelName: string) {
  return get()[modelName];
}

export function setCookie(modelName: string): void {
  Cookies.set(
    SINCE_LAST_COOKIE,
    JSON.stringify({
      ...get(),
      [modelName]: new Date().getTime()
    })
  );
}
