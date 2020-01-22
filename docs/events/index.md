---
next: /mocking/
prev: /configuration/
---

# Events

## Introduction

An "event" as it relates to this plugin is any external event which will (or has the
potential to) have an impact on state. Both "actions" and "mutations" are not events
themselves but are involved in managing events to the appropriate state change.

Actions typically originate from **Firemodel** but can also originate from this plugin
too. They are the _first responders_ to an event which is driven by some externality
(database change, user action, etc.). While actions are the first responder, they actually
don't change the Vuex state tree themselves but instead call one or more _mutations_ to
achieve state change.

Mutations are synchronous functions -- equivalent to a "reducer" in Redux parlance -- that
directly manipulate state. Also another key distinction between Actions and Mutations is
that while Actions can see and act on the whole state tree, Mutations are isolated to
their scope of the state tree (see assumptions).

### Assumptions

- When using this plugin it is assumed that you will be using Vuex's
  [modules with namespacing](https://vuex.vuejs.org/guide/modules.html). For any project
  beyond a simple one this is considered best practice as namespace collisions will start
  to be hard to avoid.
- We also expect that you will define all of your state -- at least that which is backed
  by your Firebase database -- with **Firemodel** `Model` classes

### Mutations and Actions

The mutations and actions we need to concern ourselves with when using this plugin are:

- **Config Mutations** - mutations which work on the `@firemodel` part of the state tree;
  this state is somewhat "meta" but is still important to most apps
- **CRUD Mutations** - mutations which reflect change to the core state of the app
- **Firemodel Actions** - the Firemodel library dispatches a set of actions defined by the
  exported enumeration `FmEvents`; this plugin responds to all of them by creating
  mutations. As a consumer of this plugin you will _not_ be directly exposed to these
  actions (unless you want to be) but it is worth understanding what they are.

We will now go through each of these sections in more detail.

## Config Mutations

The _config_ mutations are those which `vuex-plugin-firemodel` uses to manage it's own
section of the state tree (aka, `@firemodel`). Mutations originate from either
**Firemodel** actions or this plugin's actions firing off `commit()` calls to Vuex.

All mutations are defined by the `FmConfigMutation` enumeration which is exported by this
plugin. You can see it's definition below (it is also available as an export to this
library):

<<< @/src/types/mutations/FmConfigMutation.ts

Typically these mutations are _self-managed_ and consumers of this plugin can largely
ignore the mutations themselves but the "state" which is created by these mutations is
often quite useful for consumers.

## CRUD Mutations

### Description

CRUD (Create, Update, and Delete) mutations are mutations which originate from
**Firemodel** actions but specifically from changes to state in the database (or
"predicted" change to the database). These changes to state take place throughout the Vuex
state tree. Anywhere _except_ the `@firemodel` state tree.

Because mutations can only operate on their
[module's](https://vuex.vuejs.org/guide/modules.html) area of the state tree you will need
to define each Firemodel `Model` which your app is using as a module in the Vuex store.
Fortunately the "state" for that module is defined by the `Model` and you can leverage the
mutations that this plugin provides.

This means that these mutations are defined by this plugin but in order to use them you
will need import them into your state modules.

### CRUD Mutations List

The list of CRUD mutations that this plugin will fire into Vuex is defined by the
`FmCrudMutation` enumeration and listed below:

<<< @/src/types/mutations/FmCrudMutation.ts

> Note: that each of these mutations, when actually _committed_ will be committed into a
> namespace which is defined for the given `Model` which has changed

### Importing CRUD Mutations

## Firemodel Actions
