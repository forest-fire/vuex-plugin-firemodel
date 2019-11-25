import { IAuthChangeContext } from "../types/index";
import { User } from "@firebase/auth-types";
export declare const authChanged: <T>(context: IAuthChangeContext<T>) => (user: User | null) => Promise<void>;
