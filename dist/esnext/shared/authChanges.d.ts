import { IFmAuthenticatatedContext } from "../private";
import { User } from "@firebase/auth-types";
export declare const authChanged: <T>(context: IFmAuthenticatatedContext<T>) => (user: User | null) => Promise<void>;
