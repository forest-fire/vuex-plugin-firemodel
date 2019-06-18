---
next: "/configuration/"
---

# Getting Started

A plugin that removes all the cruft in responding to **FireModel** actions.

## Installing

To install this plugin, go to the root of your VueJS project root and type:

```sh
npm install --save vuex-plugin-firemodel
```

You then must add this plugin into Vuex's "plugin" array configuration. You'll do this
whereever you initialize your store, typically in

- `src/store/index.ts`, but also
- `src/store.ts` is pretty common for smaller projects

```typescript{8}
import { FirePlugin } from vuex-plugin-firemodel;

const store = new Vuex.Store<IRootState>({
  modules: {
    ...
  },
  plugins: [
    FirePlugin( config ),
    // any other plugins you are using
  ],
})
```

> See the `configuration` section for more on how to configure

## Using

Using the Vuex devtool plugin have a look at your state tree and you'll notice that even without any configuration you'll now have a `@firemodel` branch in your state tree. Congrats, you are now started but to get real use out of this plugin continue onto the [configuration](/configuration/) section.
