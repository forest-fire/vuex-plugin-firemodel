import { database } from "../../store";

export class EmailAuthProvider {
  static async credential(email: string, password: string) {
    const db = await database();
    return db.authProviders?.EmailAuthProvider.credential(email, password);
  }
}
