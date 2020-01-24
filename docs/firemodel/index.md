---
prev: /abc-api/
next: /mocking/
---
# Firemodel API

While the ABC API described in the prior section is sexy and new, behind the covers it relies entirely on the Firemodel API (which is no slouch either in the sexy and cool department). For comprehensive documentation on Firemodel itself you should point your browser to the official docs site: [Firemodel Documentation](https://firemodel.info).

For now we'll show you a few examples that will get you started in using the API:

## CRUD Examples

### Creating a new Record

Creating a new Model in Firemodel is as simple as:

```typescript
import { Record } from 'vuex-plugin-firemodel';

await Record.add(UserProfile, {
  name: "Bob Smith",
  age: 45,
  favoriteColor: "blue"
})
```

### Updating a Record

Updating a new Record in Firemodel is a non-destructive operation and assuming the above record resolved to an `id` of "1234" you could update it with:

```typescript
import { Record } from 'vuex-plugin-firemodel';

await Record.update(UserProfile, { favoriteColor: "green" })
```

### Removing a Record

Although typically we suggest that record's have a `status` property that allows records to be marked for deletion rather than full-on deletion there are definitely cases where what you want to do is delete:

```typescript
import { Record } from 'vuex-plugin-firemodel';

await Record.remove(UserProfile, "1234")
```

## Other Topics

### Importing from the right Source

In this day of "auto-complete" is easy to have your imports of **Firemodel** symbols to mistakenly be imported directly from **Firemodel**. This should be avoided as all of the Firemodel symbols are made available in this plugin and furthermore some of the static properties defined in one export will not carry over to the other. 

```typescript
// do this
import { Record, List, ... } from 'vuex-plugin-firemodel';
// not this ...
import { Record, List, ... } from 'firemodel';
```