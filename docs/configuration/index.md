---
lineNumbers: true,
next: "/events/"
---

# Configuration

## Introduction

What you get out of this plugin in in large part related to how you configure it. The idea
behind this configuration is to take full advantage of **FireModel**'s watchers and in
turn **Firebase**'s "real time" database characteristics. Hopefully this idea is not
foreign to you but in a nutshell what we mean is that we should configure this plug so
that we can "subscribe" to a series of "event streams" that represent change in the
database that we care about.

After the high-minded statement, let's take the theory down a notch and look at an example
configuration:

```typescript
const config = {
  connect: env.firebaseConfg, // no default value provided
  // Auth Features
  fireAuth: true, // default is true
  passiveAuth: true, // default is false
  // Lifecycle features
  lifecycle: {
    onConnect,
    onLogin,
    onLogout
  }
};
```

This configuration would then be added to your initialization of this plugin like so:

`src/store/index.ts` (or comparable)

```typescript
const store = new Vuex.Store<IRootState>({
  // ...
  plugins: [
    FirePlugin(config)
  ]
}
```

To understand what this is doing let's take it section by section.

## Connect

In many cases you'll want to immediately connect your database once your VueJS application
starts. If that is the case then you should pass in your firebase configuration to this
parameter and it will ensure that the DB is connected.

```typescript
connect: IFirebaseClientConfig | () => IFirebaseClientConfig
```

Optionally you _can_ pass in a function which allows you to take execution control over
prior to the connection attempt.

## Auth

### Firebase Auth

This plugin plays nicely with Firebase's Authentication/Identity service and by default
assumes you are using it (aka, `fireAuth` defaults to `true`). This provides you with
event hooks for any change to the authentication state (more in the lifecycle hooks
section).

### Passive Authentication

In addition to just stating that you'd like to use Firebase's authentication/authorization
system, you can also opt-in to `passiveAuth`. When this feature is turned on this plugin
will -- immediately after connecting to the DB -- check for the appropriate tokens of a
logged in user and _re_-login the user. If, however, there is no user tokens the existing
session is logged in as an anonymous user.

### Custom Claims

Firebase allows for the concept off
["custom claims"](https://firebase.google.com/docs/auth/admin/custom-claims) which are in
effect a secure way of implementing "role based authorization". This plugin will expose
any roles/claims that the given user has as part of the `@firebase/claims` property.
However, without any explicit setting of claims, the claims for a user will never be set.
Fortunately **FireModel** has an _opinionated_ way of interacting with claims which in
most cases will be a big time saver. Check out the docs here:
[FireModel | Authentication & Authorization](https://firemodel.info/using/auth.html)

## Lifecycle Hooks

### Overview

This plugin provides the following lifecycle events which you can plug into to
add/remove/update the paths in the database which you are interested in (aka, which paths
you are "watching"):

- `onConnect(initial: boolean) => void` - as soon as the database is connected; this is
  the initial connection but also applies to subsequent connections if the database had
  gone down sometime after the initial connection.
- `onDisconnect() => void` - if the database disconnects at any point after the initial
  connection.
- `onLogin(uid: string, isAnonymous: boolean, ...) => void` - as soon as a user is logged
  in then this event is fired
- `onLogout(uid: string, isAnonymous: boolean, ...) => void` - as soon as a user is logged
  out this event is fired, allowing you to cleanup/change watchers

> **Note 1:** all lifecycle hook functions are `async` functions

> **Note 2:** the `onConnect()` and `onDisconnect()` events are listened to by this plugin
> and they in turn ensure that the `@firemodel` state tree always has a up-to-date view on
> this for your application.

### Examples of Usage

Let's now take a look at a few examples of what you might do with these hooks:

#### Listen to `UserProfile` on Login

Imagine that when you login using Firebase's identity system, you want to then start
watching the database on the given logged in user's "user profile":

```typescript
export async onLogin({ uid }) {
  await Watch.record(UserProfile, uid, { name: 'user-profile' });
}
```

#### Get all `Products` once connected

Imagine we have a store application and as soon as possible we want to pull down a list of
products (and inventory levels) from the store and then be kept up-to-date if anything
changes.

```typescript
export async onConnect() {
  await Watch.list(Product).all();
}
```

#### On logging out, Stop watching `UserProfile`

Once we've logged out we should have no interest in watching the user profile of the user
who _had_ been logged in (we also probably have no rights to anymore). In order to remove
our interest in the old user's `UserProfile` we could:

```typescript
export async onLogout() {
  await Watch.stop(Watch.findByName('user-profile'));
}
```
