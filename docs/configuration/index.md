---
lineNumbers: true
next: "/events/"
---

# Configuration

What you get out of this plugin in in large part related to how you configure it. The idea
behind this configuration is to take full advantage of **Firemodel**'s watchers and in
turn **Firebase**'s "real time" database characteristics. Hopefully this idea is not
foreign to you but in a nutshell what we mean is that we should configure this plug so
that we can "subscribe" to a series of "event streams" that represent change in the
database that we care about.

## Example Config

Let's take the theory down a notch and look at an example configuration:

```typescript
const config = {
  // config for Firebase DB
  db: {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "..."
  },
  // connect db when initialized (true is the default)
  connect: true,
  // Auth Features
  watchAuth: true,
  anonymousAuth: true,
  // Lifecycle hooks
  lifecycle: {
    onConnect,
    onLogin,
    onLogout,
    onRouteChange
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

In our example we instantiated a `abstracted-admin` DB connection object and passed this in
as our means to allow this plugin to interact with Firebase. Note that the db connection
object as been passed into this plugin but we're **not** waiting for the actual _connection_
to the database to be established before moving forward. This is not only "fine" but the
expected means of passing the DB connection to this plugin.

Another way of achieving the same outcome -- and at the same time avoiding the need to create
the `db` connection within the frontend app -- is to simply pass your database configuration
into this plugin:

```typescript
const db = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "..."
}
const config = {
  db,
  // ...
```

This means of connecting to the database is probably the cleanest in applications where you don't need to have a direct connection to the `abstracted-admin` reference. In fact, even in these cases,you could still regain that reference if you wanted to by taking it from `FireModel.defaultDb`. In either case though you'll have setup this plugin to connect correctly.

## Auth

### Watch Auth

This plugin plays nicely with Firebase's Authentication/Identity. When this service is enabled the opens up the use of the `onLoggedIn` / `onLoggedOut` lifecycle events. In general, if you are using Firemodel's Auth API then you should probably set this to `true`.

In addition to enabling the `onAuthChanged` lifecycle hook, it also gives you a guarentee that the logged in users ["custom claims"](https://firebase.google.com/docs/auth/admin/custom-claims) are available at  `@firebase/claims` in the state tree.

By default, this service is turned off.

### Anonymous Authentication

In addition to just stating that you'd like to use Firebase's authentication/authorization
system, you can also opt-in to `anonymousAuth`. When this feature is turned on this plugin
will -- immediately after connecting to the DB -- check for the appropriate tokens of a
logged in user and _re_-login the user. If, however, there is no user tokens the existing
session is logged in as an *anonymous* user.

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
