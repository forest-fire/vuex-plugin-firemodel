---
next: /mocking/
prev: /configuration/
---

# Events

The _events_ which we need to concern ourselves with when using this plugin are:

- **Config Mutations**
  - there actions which are received where the state change is reflected only in the
    `@firemodel` part of the state tree
  - you will see these mutations in the Vuex devtools and their state changes should
    intellectually make sense and hopefully help you understand what is happening over
    time but they do _not_ impact other parts of the state tree (at least by default)
- **CRUD Mutations**
  - this is ultimately the most important area ... it is where your application's state
    changes actually be _mutated_ into Vuex.
  - You are entitled to write any mutation you want but in most cases there are some
    simple ways to have this plugin do it for you
- **FireModel Actions**
  - the FireModel library dispatches a set of actions defined by the exported enumeration
    `FmEvents`; this plugin responds to all of them by creating mutations. As a consumer
    of this plugin you will _not_ be directly exposed to these actions (unless you want to
    be) but it is worth understanding what they are. In most ways, however, the _actions_
    are less interesting than the _mutations_ which are triggered.

We will now go through each of these sections in more detail.
