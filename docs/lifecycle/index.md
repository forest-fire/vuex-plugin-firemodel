---
next: /mocking/
prev: /configuration/
---
# Lifecycle Events

<center style="width: 100%; height: 50px;">
<svg width="90" fill="#333" viewbox="0 0 90 35" xmlns="http://www.w3.org/2000/svg"><path d="M16.568 62.372H5.994a.993.993 0 100 1.988h10.574a.994.994 0 100-1.988zM46.27 62.372H36.141l-4.696-3.211v3.211h-8.674a.993.993 0 100 1.988h8.674v3.213l4.699-3.213H46.27a.994.994 0 100-1.988zM77.229 62.372H67.1l-4.695-3.211v3.211H53.73a.993.993 0 100 1.988h8.674v3.213l4.699-3.213h10.125a.994.994 0 00.001-1.988zM94.006 62.372H83.432a.993.993 0 100 1.988h10.574a.994.994 0 100-1.988zM57.215 39.631c0-3.972-3.232-7.204-7.205-7.204-3.971 0-7.204 3.232-7.204 7.204 0 3.65 2.733 6.669 6.258 7.135-.02.079-.048.154-.048.239v16.362a.993.993 0 101.988 0V47.005c0-.085-.027-.16-.047-.239 3.525-.466 6.258-3.485 6.258-7.135zm-12.42 0a5.222 5.222 0 015.215-5.216c2.876 0 5.216 2.34 5.216 5.216s-2.34 5.216-5.216 5.216a5.222 5.222 0 01-5.215-5.216zM87.533 39.631c0-3.972-3.23-7.204-7.203-7.204-3.971 0-7.205 3.232-7.205 7.204 0 3.65 2.734 6.669 6.26 7.135-.021.079-.049.154-.049.239v16.362a.993.993 0 101.988 0V47.005c0-.085-.029-.16-.049-.239 3.526-.466 6.258-3.485 6.258-7.135zm-12.42 0a5.222 5.222 0 015.217-5.216c2.875 0 5.215 2.34 5.215 5.216s-2.34 5.216-5.215 5.216a5.222 5.222 0 01-5.217-5.216zM26.875 39.631c0-3.972-3.231-7.204-7.204-7.204s-7.204 3.232-7.204 7.204c0 3.65 2.732 6.669 6.258 7.135-.02.079-.048.154-.048.239v16.362a.993.993 0 101.988 0V47.005c0-.085-.029-.16-.049-.239 3.526-.466 6.259-3.485 6.259-7.135zm-12.42 0a5.221 5.221 0 015.216-5.216c2.875 0 5.215 2.34 5.215 5.216s-2.34 5.216-5.215 5.216a5.221 5.221 0 01-5.216-5.216z"/></svg> 
</center>

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
