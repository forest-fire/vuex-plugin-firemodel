export class EmailAuthProvider {
    /**
     * Given a _email_ and _password_, this endpoint provides a **credential**
     * which can be added to a user's user profile (in Firebase's Identity system).
     */
    // public static async credential(
    //   email: string,
    //   password: string
    // ): Promise<UserCredential> {
    //   const db = await database();
    //   const auth = await db.auth();
    //   // return auth.currentUser.EmailAuthProvider.credential(
    //   //   email,
    //   //   password
    //   // );}
    // }
    /**
     * Initialize an EmailAuthProvider credential using an email and an email link
     * after a sign in with email link operation.
     *
     * @param email     the email of the user
     * @param emailLink the sing-in email link
     */
    static async credentialWithLink(email, emailLink) {
        //
    }
}
