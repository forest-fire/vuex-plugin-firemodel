# Firebase Auth

Beyond the two core features that this plugin provides, the plugin also makes
parts of the Firebase Auth API surface as Vuex _actions_ that you can dispatch.
These include:

### `signInWithEmailAndPassword`

Allows an existing user to sign into Firebase with just an email and password.

You dispatch with:

```typescript
const { dispatch } from './store';
let user: UserCredential;
try {
  const user = await dispatch('@firemodel/signInWithEmailAndPassword', {
    email: string,
    password: string
  })
} catch (e) {
  // error handling
}
```

Errors include:

- `auth/invalid-email`
- `auth/user-disabled`
- `auth/user-not-found`
- `auth/wrong-password`

### `createUserWithEmailAndPassword`

Creates a new user from an email and password

You dispatch with:

```typescript
const { dispatch } from './store';
let user: UserCredential;
try {
  const user = await dispatch('@firemodel/createUserWithEmailAndPassord', {
    email: string,
    password: string
  })
} catch (e) {
  // error handling
}
```

Errors include:

- `auth/email-already-in-use`
- `auth/invalid-email`
- `auth/operation-not-allowed`
- `auth/weak-password`

For more info, check the **Firebase** docs:
[createUserWithEmailAndPassword](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#create-user-with-email-and-password)

### `sendPasswordResetEmail`

Sends a user an email with a link to reset their password.

You dispatch with:

```typescript
const { dispatch } from './store';
try {
  await dispatch('@firemodel/sendPasswordResetEmail', {
    email: string,
    actionCodeSettings?: ActionCodeSettings | null
  })
} catch (e) {
  // error handling
}
```

Errors include:

- `auth/invalid-email`
- `auth/missing-continue-uri`
- `auth/invalid-continue-uri`
- `auth/unauthorized-continue-uri`
- `auth/user-not-found`

For more info, check the **Firebase** docs:
[sendPasswordResetEmail](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#send-password-reset-email)

### `confirmPasswordReset`

Completes the password reset process, given a _confirmation code_ and new
_password_.

You dispatch with:

```typescript
const { dispatch } from './store';
try {
  await dispatch('@firemodel/confirmPasswordReset', {
    email: string,
    newPassword: string
  })
} catch (e) {
  // error handling
}
```

Errors include:

- `auth/expired-action-code`
- `auth/invalid-action-code`
- `auth/user-disabled`
- `auth/user-not-found`
- `auth/weak-password`

See the **Firebase** docs for more:
[confirmPasswordReset](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#confirm-password-reset)

### `verifyPasswordResetCode`

Checks whether an out-of-band reset code was correct; if correct it will return
the user's email. Call structure would look like:

```typescript
const { dispatch } from './store';
let validatedEmail;
try {
  validatedEmail = await dispatch('@firemodel/verifyPasswordResetCode', '12345');
} catch(e) {
  // error handling
}
```

Failing conditions include:

- `auth/expired-action-code`
- `auth/invalid-action-code`
- `auth/user-disabled`
- `auth/user-not-found`

See the **Firebase** docs for more:
[verifyPasswordResetCode](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#verify-password-reset-code)

### `updateEmail`

Updates the user's email for login/auth.

```typescript
const { dispatch } from './store';
try {
await dispatch('@firemodel/updateEmail', newEmail: string);
} catch(e) {
// error handling
}
```

Failing conditions include:

- `auth/invalid-email`
- `auth/email-already-in-use`
- `auth/requires-recent-login`

See the **Firebase** docs for more:
[updateEmail](https://firebase.google.com/docs/reference/node/firebase.User.html#update-email)

### `updatePassword`

Updates the user's password for login/auth.

```typescript
const { dispatch } from './store';
try {
  await dispatch('@firemodel/updatePassword', newPassword: string);
} catch(e) {
  // error handling
}
```

Failing conditions include:

- `auth/weak-password`
- `auth/requires-recent-login`

See the **Firebase** docs for more:
[updatePassword](https://firebase.google.com/docs/reference/node/firebase.User.html#update-password)

### `signOut`

Signs the user out of a non-anonymous account (and if anonymous authentication
is on it will log you in as an anonymous user for tracking purposes)

You will dispatch with:

```typescript
const { dispatch } from './store';
try {
  await dispatch('@firemodel/signOut')
} catch (e) {
  // error handling
}
```

Errors include:

- `auth/email-already-in-use`
- `auth/invalid-email`
- `auth/operation-not-allowed`
- `auth/weak-password`

For more info, check the **Firebase** docs:
[signOut](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#sign-out)
