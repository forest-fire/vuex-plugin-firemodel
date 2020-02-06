### Examples of Usage

Let's now take a look at a few examples of what you might do with these hooks:

#### Listen to `UserProfile` on Login

Imagine that when you login using Firebase's identity system, you want to then
start watching the database on the given logged in user's "user profile":

```typescript
export async onLogin({ uid }) {
  await Watch.record(UserProfile, uid, { name: 'user-profile' });
}
```

#### Get all `Products` once connected

Imagine we have a store application and as soon as possible we want to pull down
a list of products (and inventory levels) from the store and then be kept
up-to-date if anything changes.

```typescript
export async onConnect() {
  await Watch.list(Product).all();
}
```

#### On logging out, Stop watching `UserProfile`

Once we've logged out we should have no interest in watching the user profile of
the user who _had_ been logged in (we also probably have no rights to anymore).
In order to remove our interest in the old user's `UserProfile` we could:

```typescript
export async onLogout() {
  await Watch.stop(Watch.findByName('user-profile'));
}
```

## Advanced Use Cases

### Watching Lists of Records with `list().ids(...)`

There are situations where you will want to setup a **list** watcher which is attached to an array of `id`'s but because you don't have permissions to see the whole list you can not use the simple syntax of:

```typescript
const watcher = await Watch.list(MyModel).where('uid', '1234');
```

but must rely instead on:

```typescript
const watcher = await Watch.list(MyModel).ids(anArrayOfIds);
```

This alternative isn't hard so long as you have the list of `id`s but when doing this it can potentially leads to an edge case that's worth understanding.

To illustrate, imagine the scenario where you have a list of orders but the logged in user only has read permission to read orders which they own. We might watch the user's orders by first watching the UserProfile like so:

```typescript
await Watch.record(UserProfile, '1234');
```

And assuming, that you have a relationship setup between `UserProfile` and `Order` you might then:

```typescript
const recentOrders = Object.keys(state.userProfile.orders).slice(0,3);
await Watch.list(Order).ids(recentOrders);
```

This will achieve all the results you want when the user logging in has `recentOrders` but imagine that a new user has logged in and they have no orders but our application requires that there is always at least _one_ order. Well this shouldn't be hard, right? You can just add the order with:

```typescript
const newOrder = await Record.add(Order, { ... })
await user.associate(orders, newOrder.id)
```

This in fact _does_ work in most ways but one ... the problem you're going to find is that since the `Order` you've just added does not have a "watcher" associated with the path yet you'll get a Vuex mutation to `order/add` but in your local state tree you've configured to have a _list_ of orders and therefore the local state tree expects the mutation to be `orders/add` (aka, plural).

Once you have setup a list watcher on `Order` -- which you can do right after you've added the record -- all future updates to the record will be correctly mutated to the plural "**orders**" because the watcher is in place. How can we get around this _chicken-and-egg_ problem? The answer lies in a property in the optional _options_ hash:

```typescript
const newOrder = await Record.add(Order, { ... }, { pluralizeLocalPath: true })
```

This will ensure that the Vuex mutation is sent to the right place the first time and then -- assuming you setup the list watcher -- all subsequent items will be as well.