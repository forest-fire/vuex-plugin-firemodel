---
prev: /getting-started/
next: /abc-api/
---
# Firemodel API

If you've used Firemodel on the front or backend you'll be happy to know you can use the full API and it will automatically hook into Vuex's `dispatch()` function! In turn the dispatchs will automatically be handled by this plugin's **Actions** which in turn will fire **Mutations** which you'll have already configured your modules with if you followed the [Getting Started](/getting-started/) section.

That make take a moment to sink in but to help the _sinking in process_ we'll provide a few examples:

## Watching creates change Automatically

### Watching Products

Let's say you're interested in knowing about all the `Products` which are in the system. You might decide to _watch_ them as part of the `onConnect` event:

**`src/lifecycle/onConnect.ts`**

```typescript
export async function onConnect({ Watch }) {
  await Watch.list.all(Product).start();
}
```

This will immediately make sure that Vuex has all of the current products in Firebase. All in one line of code. That feels pretty good but party is just getting started.

### Adding a new Product locally

Ok so now you want to _add_ a new product in your app. Well that's easy:

```typescript
import { Record } from 'vuex-plugin-firemodel';

await Record.add(Product, {
  name: "Magic Carpet",
  price: 45
});
```

What happened? In a nutshell ... everything:

- You added the product locally and it was immediately added to Vuex optimistically (`products/LOCALLY_ADDED`)
- it then told Firebase about the product
- Firebase agreed that that new Product should be added 
- the confirmation made it back to Vuex and the record became "confirmed" (`products/SERVER_CONFIRMATION`)

### An External Change

Now let's imagine that somewhere in the marketing department they realized that the Magic Carpet was really priced too expensively to move the units they need so they've gone into _their_ app and updated the price to `32`. What happens?

- The Firebase change is detected at the _watched_ path and immediately triggers a `products/SERVER_CHANGE` mutation
- this updates the price to 32 in Vuex and the marketing department's job is now complete



## The Full API

The above example shows the simplicity in both creating change as well becoming informed of change (whether you were the originator of the change or not) but the Firemodel API is pretty far reaching. For more information this powerful API have a look at the [Firemodel API docs](https://firemodel.info).

As an alternative to the **Firemodel API** this plugin also presents you with the **ABC API** which assumes usage within a browser and with access to browser API's like cookies and IndexedDB. Go to the next section for more on this.