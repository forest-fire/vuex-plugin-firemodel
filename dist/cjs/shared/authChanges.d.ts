import { IFmAuthEventContext } from "../types/index";
import { User } from "@firebase/auth-types";
export declare const authChanged: <T>(context: Partial<IFmAuthEventContext<T>>) => (user: User | null) => Promise<void>;
