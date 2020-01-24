---
lineNumbers: true
sidebarDepth: 2
next: "/events/"
---

# Plugin Configuration

What you get out of this plugin in in large part related to how you configure
it. The idea behind this configuration is to take full advantage of
**Firemodel**'s watchers and in turn **Firebase**'s "real time" database
characteristics. Hopefully this idea is not foreign to you but in a nutshell
what we mean is that we should configure this plug so that we can "subscribe" to
a series of "event streams" that represent change in the database that we care
about.

## Basics

### Example Config 
Let's take the theory down a notch and look at an example configuration:

```typescript
const config: IFirebaseConfig<IRootConfig> = {
  // Firebase config
  db: {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "..."
  },
  // core services
  connect: true,
  useAuth: true,
  // Lifecycle hooks
  lifecycle: {
    // for all users
    onConnect,
    // only if using Firebase Auth
    onAuth,
    onLogin,
    onLogout,
    // only if using vuex-plugin-router
    onRouteChange
  }
};
```

This configuration would then be added to your initialization of this plugin
like so:

`src/store/index.ts` (or comparable)

```typescript
const store = new Vuex.Store<IRootState>({
  // ...
  plugins: [
    FirePlugin<IRootState>(config)
  ]
}
```

The details of this configuration will be explored in the following three sections:

1. **DB Configuration** - you must provide the normal Firebase client configuration so this plugin can connect to the database for you (alternatively you can provide config for a "mock database" ... more on that later)
2. **Core Services** - there are core services that you get out of the box which you can opt-in/out of.
3. **Lifecycle Hooks** - certain application lifecycle events are predictable and this plug-in makes it easy to take actions whenever these events are fired (all of the config under `lifecycle`) relates to that.

### Correct `IRootState` typings

But before we move into these sections let's look at some key _typings_ that will help you configure correctly:

- `IFiremodelConfig<T>` - your configuration is fully typed and beyond just a "signature", it also includes comments:

  ![typing support](./typing-support.png)

  > Note that in our example we broke out the `config` as a separate variable so we had to explicitly state the typing but if you configure this plugin inline with the plugin (a reasonable enough thing) the typing will just come in "for free" (as is the case in this picture).

- `IRootState` - this plugin assumes you are using Vuex _modules_ and that to garner typing information you would have already gathered your _state tree_ into a type. Right now, to get support not only for your modules but also for this plugin's typing you must do something like:

    ```typescript
      export interface IRootState {
        orders: IOrdersState
        customer: ICustomer
        products: IProductsState
        // TODO: this should be handled within the plugin
        ['@firemodel']: IFiremodelState<IRootState>
    }
    ```

  The intent is to remove this requirement but at the moment you do need to do this

## Core Services


### When to Connect

By default this plugin will connect with the database immediately. That is
probably the correct behavior 99% of the time but on the chance you _don't_ want
it to connect right away you can set the `connect` property to false. If you do
this then you would take on responsibility to **dispatch** the
`@firemodel/connect` action at the point where you _do_ want to connect.

### Firebase Auth

Authentication and Authorization are critical features of almost every app and
Firebase provides a great set of services to make this sometimes tricky process
relatively easy. There are, of course, entitled to use other solutions out there 
so you can set this to false if you don't plan on using it:

```typescript
useAuth: false;
```

If you _are_ using Firebase authentication you can simply opt-in by setting the
configuration value to `true` but there are options and if you choose to set these
then you would replace the boolean flag with an options dictionary, where:

- `presistence` - provides a way to state how long the Firebase client should
remember the user for. The options are: _none_, _session_, and _local_ and if 
not stated the default is _local_. For more details see the docs: 
[Auth State Persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- `anonymousAuth` - a powerful feature of the Firebase Auth is to give visitors
an "anonymous user" account when they land. By doing so the user is now more 
easily tracked and this can be quite helpful for understanding how non-users of
your solution are viewing the site prior to (hopefully) signing up. By default
this is turned off but by setting to _true_ you will immediately have visitors
either be "known users" or "anonymous users" and thereby always have a `uid` to
use for tracking.

This flag, when set to true, will setup a callback with Firebase which allows
the plugin to be informed of any _auth_ related events. In turn it will do two
things:

1. Keep the `@firebase/currentUser` up to date
2. Call the `onLoggedIn` / `onLoggedOut` lifecycle events as appropriate.

By default, this service is turned on.

#### Anonymous Authentication

In addition to just stating that you'd like to use Firebase's
authentication/authorization system, you can also opt-in to `anonymousAuth`.
When this feature is turned on this plugin will -- immediately after connecting
to the DB -- check for the appropriate tokens of a logged in user and _re_-login
the user. If, however, there is no user tokens the existing session is logged in
as an _anonymous_ user.

This means that everyone interacting with the site _will_ be a tracked user of
some sort. Some will be "known users" and others will be "anonymous users" but
all will have a unique ID that tracks the identity of the user.

## Lifecycle Hooks

### Overview

This plugin provides the following lifecycle events which you can plug into to
add/remove/update the paths in the database which you are interested in (aka,
which paths you are "watching"):

- `onConnect()` - as soon as the database is connected;
  this is the initial connection but also applies to subsequent connections if
  the database had gone down sometime after the initial connection.
- `onDisconnect()` - if the database disconnects at any point after the
  initial connection.

For configurations that are using Firebase's Auth solution, the following events
will also be available:

- `onAuth()` - When a user first arrives on the site/app, there is a two step process
  where first we must 
- `onLogin(uid: string, isAnonymous: boolean, ...) => void` - as soon as a user
  is logged in then this event is fired
- `onLogout(uid: string, isAnonymous: boolean, ...) => void` - as soon as a user
  is logged out this event is fired, allowing you to cleanup/change watchers

Finally, for those users who have configured their state tree to include the apps
current route, then you will also receive:

- `onRouteChanged()`

> **Note:** all lifecycle hook functions are `async` functions


