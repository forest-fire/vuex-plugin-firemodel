# ABC API

<center>
  <svg height="50" width="100" fill="#333" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 46.4"><path d="M81.9 17.3c0-1 .8-1.7 1.7-1.7 1 0 1.7.8 1.7 1.7 0 1-.8 1.7-1.7 1.7-.9 0-1.7-.7-1.7-1.7zm11.5 23.5c-.8.4-1.6.6-2.5.6-.4 0-.8 0-1.1-.1-3.6-.9-12.4-3.1-17.3-6.2-7 2.6-14.6.5-20.7-1.1-3.4-.9-6.3-1.7-8.3-1.5-.6 1.7-2.9 5.9-9.9 6.1-5.9.2-11-2.6-12.5-5.4 0-.1-.1-.1-.2-.1 0 0-.1 0-.2.1L16 37.7c-2.4 2.3-5.6 3.3-8.8 2.9-.9-.1-1.7-.8-2-1.6s-.1-1.8.6-2.5L17.7 25c.9-.8 2.1-1.2 3.3-1.1 1.1.1 1.9-.1 2.6-1.3-2.1-1.2-4-3.5-5-6.4-1.1-3-1.1-5.9.1-8l.5-1 .8.5c.2.2 5.3 3.5 7.6 6.4 3.2-1.9 10.6-3.6 20.3-1.6 6.8 1.4 12.2 1.6 16.4 1.2-6.9-1.3-16.3-3.7-20-6.8l-1.9-1.6 2.5-.2c16.3-1.1 34 1.2 43 5.5 4.2 2 6.4 4.1 6.8 6.5.4 2.6-1.4 4.8-3 6.4-2.8 2.8-7 4.1-13.1 3.8 4.3 3.5 10.6 6.1 14.4 7.4 1.2.4 2 1.5 2.1 2.7 0 1.6-.6 2.7-1.7 3.4zm-.4-2.9c0-.5-.3-.9-.8-1-5.6-2-13.1-5.3-17.2-9.9l-1.7-1.9 2.6.3c7 .8 11.5-.2 14.3-3 1.9-1.9 2.7-3.4 2.5-4.7-.3-1.7-2.2-3.4-5.7-5.1-8.2-4-23.8-6.1-38.8-5.5 6.2 3 17.9 5.2 22.6 5.7l6 .7-5.9 1.3c-7.4 1.7-14.9 1.6-23.4-.2-10.5-2.3-17.7.2-19.5 1.7l-.9.7-.6-1c-1.1-1.8-4.5-4.5-6.6-6-.4 1.5-.3 3.4.4 5.3 1 2.7 2.9 4.9 4.8 5.7l.9.3-.3.9c-.9 2.6-2.5 3.8-5.1 3.5-.6-.1-1.2.1-1.7.5L7.1 37.8c-.1.2-.1.4-.1.5 0 .1.1.3.3.3 2.6.4 5.3-.5 7.2-2.3l4.7-4.5c.5-.5 1.2-.7 1.9-.6.7.1 1.3.5 1.6 1.1 1 1.9 5.3 4.5 10.7 4.3 7.1-.2 8.1-5.1 8.2-5.2l.1-.6.6-.1c.2 0 .3-.1.5-.1.5-.5 1.1-.9 1.8-1.3l.5.9-.6.3c2.1.1 4.7.8 7.6 1.6 5.6 1.5 12.6 3.4 18.8 1.4-.2-.2-.5-.4-.7-.6l.8-.9c.4.3.8.6 1.2 1l.5-.2.4.3c4.6 3 13.5 5.4 17.1 6.2.7.2 1.5.1 2.1-.3.5-.2.7-.6.7-1.1zm-45.4-9.8l.3 1c.9-.2 1.8-.4 2.9-.5l-.1-1c-1.2.1-2.2.3-3.1.5zm6.1-.8v1h3v-1h-3zm5.9 1.3c1 .1 2 .3 2.9.5l.2-1c-1-.2-1.9-.4-3-.5l-.1 1zm5.7 1.3c.9.4 1.8.8 2.6 1.3l.5-.9c-.9-.5-1.8-1-2.7-1.4l-.4 1z"/></svg>
</center>

The acronym **`ABC`** used to be used in a lot of old sales training classes to mean "always be closing" (aka, always
try to close the deal). We've borrowed the acronym for a slightly different meaning: **Always Be Caching**! What this
refers to is a new and distinct API for _getting_ data into Vuex in a highly performant way.

## Example Usage

### Usage Setup

Let's imagine for a moment that you have a _store-based_ application where you sell products. The `Product` model
defines the attributes of what you can sell and not only do you have a _lot_ of products but without this data in the
client brower/app (aka, in Vuex) you can't sell the customer anything. That's not good for "always be closing" nor
"always be caching". Let's see how the ABC API can be used to address this _example_ crises:

```typescript
import { since } from 'vuex-plugin-firemodel';

async onConnect() {
  const youDidIt = await getProducts(since());
}
```

This, all by itself, solves our ABC problem. Well, it at least helps a lot! Let's explore what we are actually getting
from this single line of code.

### Getting and Loading

When we run the code above, the call to `getProducts` will:

- query IndexedDB for any and all records that it knows about
- all IndexedDB records will be added to the Vuex store
- all products in the Vuex store will be returned and assigned to the `youDidIt` variable
- even without the _return value_ -- which in "real life" will often just be ignored -- the Vuex store is up-to-date and
  fully reactive with this data

This is all local to the browser and fully offline. It is also VERY fast. Now that you have your result set you
hopefully have a good amount of the product data that resides only in the database. That detail can be very small or
exceptionally large (if the browser's _never_ been to the site before then browser will have precisely 0 products in
local cache).

The call to `getProducts` will return to you with the local results but will also:

- request the products from the database (but only those which were changed _since_ the last time that this client last
  asked)
- as soon as the "updated products" are received from the Firebase DB, they are both injected into Vuex and stored into
  IndexedDB so that the cache is kept up-to-date
- because Vuex is updated for us; our components simply _react_ to any changes or additions when they become available

#### Get versus Load

This flow is typically highly desirable for something like products but sometimes you may find people wanting to be sure
that they have the database updates first. This too can be achieved:

```typescript
import { since } from 'vuex-plugin-firemodel';

async onConnect() {
  const youDidIt = await loadProducts(since());
}
```

This small change behaves similarly but the promise isn't resolved until not only IndexedDB has contributed it's
knowledge but we have also gotten a response from Firebase. This means if you want to ensure that you have a complete
view on Products before presenting them to the user you can. This approach is still going to be faster than just asking
Firebase for the records as you'll only be transferring the _deltas_ to Products over the wire -- with the rest sourced
locally -- but maybe the biggest benefit in this model is that your Firebase **download** bytes are massively reduced.

> Note: For those who don't pay attention to dollars and cents ... the amount you download is one of two things used to
> figure out your Firebase bill.

### Odds and Ends

You may be wondering ... how is that a _generalized_ API like that which `vuex-plugin-firemodel` is exposing has any
knowledge of a "Product" or any other entity that is relevant to my business case. The truth is ... it doesn't. The only
two functions which this plugin actually provides is `get` and `load` but there's a configuration step we have so far
skipped over. Fear not, young developer, the configuration comes next.

## ABC Configuration

### Configuring `get` for Models

In order to take advantage of the ABC API we must do a little configuration. Let's use our example from earlier but
let's add `UserProfile`, `Order`, and `Company` models to it. In this extended example that our Vuex store has:

- a list of `Order`'s owned by the currently logged in user.
- the logged in user's `UserProfile` is also represented but not as a _list_ but just a singular record
- the Company who's website is also represented as a singular object that contains meta info about the seller

The configuration we're going to do would typically be put into the `store/index.ts` file and would look something like:

```typescript
import { configApi, get } from "vuex-plugin-firemodel";
// we can setup some default values for all Models which we are configuring
// in this example, however, these config values ARE the normal defaults
configApi({
  useIndexedDb: true,
  isList: true
});
export const [getProducts, loadProducts] = abc(Product);
export const [getOrders, loadOrders] = abc(Order);
export const [getUserProfile, loadUserProfile] = abc(UserProfile, { isList: false });
export const [getCompany, loadCompany] = abc(Company, { isList: false });
```

With this config in place, methods like `getProducts` -- for all your major entities/models -- become available.

> Note: precisely the same sort of configuration can be done with `loadRecords` as we've shown here for `getRecords`.

### Security and IndexedDB

There may be cases where you recognize that while entities like `Product`s and the company meta in `Company` may have no
confidentiality of consequence, others -- like `Order`s and `UserProfile` -- may very well be considered sensitive. The
Firebase database ensures with it's security rules that only _the right people_ can access _the right data_ but if we're
then caching this data in IndexedDb this data will persist in the client world for a much longer duration (including
after we shut the browser down).

This security sensitivity must be considered when caching to IndexedDB and one option to limit this exposure is simply
to decide to NOT store certain models in IndexedDB.

```typescript
export const getOrders = getRecords({ model: Order, useIndexedDb: false });
```

Other options to reduce the risk include:

1. Ensure that when a user logs out that the IndexedDB cache is cleared.

   This plugin exports the `clearCache` symbol which can be placed into `onLogout` event:

   ```typescript
   import { clearCache } from 'vuex-plugin-firemodel'
   async onLogout() {
     await clearCache(Order);
   }
   ```

2. Use the `@encrypt` decorator when desigining your models

   **[Firemodel](https://firemodel.info)** provides a decorator called `@encrypt` which is purely decorative in
   Firemodel but when using this plugin it will look for the meta-data this decorator provides and when writing/reading
   from IndexedDb will apply a fast private-key encryption/decryption of the data on those attributes which are
   specified:

   ```typescript
   @model()
   export class Order from Model {
     @property somethingPublic: string;
     @property @encrypt somethingSecret: string;
   }
   ```

   > Note: that relationships and properties which are part of a _dynamic path_ can NOT be encrypted

   For private key encryption to be an effective tool, however, you must have a means to provide a private key. There
   are range of ways you can do this but in the end you must include it in the configuration for the model (or as part
   of the the default config hash). Here's how we might do that:

   ```typescript
   import { configApi } from "vuex-plugin-firemodel";

   // as a static string (obviously this has some strong security limitations)
   configApi = {
     privateKey: "234ksdfjl;ad342342-asdfasd-r345345"
   };

   // you might have gotten the private key from a different model which you
   // are NOT caching; or more likely you've stuffed into Firebase's Auth profile
   configApi = {
     privateKey: fromSomewhereElse || store.state["@firemodel"].currentUser.uid
   };

   // or maybe you have an API endpoint that can be called to get
   // the private key
   configApi = {
     privateKey: await myCallback()
   };
   ```

## ABC Usage

We started out with a simple example, in this section we will go into a bit more detail on what options are provided as
well as reviewing some of the _helper_ symbols that can be used so readers get a sense of the full power of this API.

### Discrete versus Query based

To understand how we use the `getRecords`-_derived_ functions we should break usage into two broad categories:

- **Discrete ID's**

  Often we will know of one or more ID's for a given model that we want. Rather than just asking for everything or a
  broad slice of records, it is often a very good usage pattern to only ask for what you need. This would be done
  something like this:

  ```typescript
  async onConnect() {
    await getProducts('1234', '4567');
  }
  ```

  By using this approach we gradually build up a set of records for a given model (_products_ in this example) and each
  time we add to the list we cache the results so that any subsequent request is able to leverage what we already know.

  > Note: the `getRecords` API is smart enough to update Vuex from cached results in IndexedDB for those records we
  > already have and then in parallel request records it doesn't yet have in cache from Firebase. You may optionally
  > decide to _warm_ the cached entries in this case too (more on that in the options section)

- **Query Based**

  In the introductory example we used a call like this:

  ```typescript
  import { since } from 'vuex-plugin-firemodel';
  import { getProducts } from '@/store';

  async onConnect() {
    await getProducts(since());
  }
  ```

  This is a good example of a _query_ based selector. Query selectors do not know any particular ID's of the underlying
  model but rather can describe a pattern that Firebase can query on. Each type of query is supported by a functional
  symbol which includes:

  - `all()`

    This provides ALL records for a given model. Clearly this query doesn't reduce the number of records of the total
    dataset so some caution should be used to ensure there isn't a more contrained way at getting at what is needed.
    That said, there are many use cases where this is exactly "what the doctor ordered".

  - `where( property, value )`

    Returns all records where a property of the model is of a certain value (using _equality_, _greater than_, or _less
    than_ operations). In traditional Firebase apps this gets a ton of use and is a nice way to reduce the dataset on
    the server side (aka, on Firebase).

  - `since( timestamp )`

    Returns a list of records which have changed since a given timestamp. This will ensure that your IndexedDB is caught
    up to Firebase and will load all the new records into Vuex.

    > **Note:** this query helper is similar to "refresh" but unlike refresh it does not ensure that all of the
    > IndexedDB records are in Vuex; only that you have a locally cached version of all records that are in Firebase.
    > Both are useful but be sure to understand the subtle differences.

  - `refresh( timestamp )`

    Immediately gets ALL records from IndexedDB and pushes them into Vuex; it then queries Firebase using a "since"
    query. This type of query is _particularly_ useful for caching architectures because it is very common to want to
    only get those records that have changed since the last time your cache was in sync. This ensures you get a compact
    dataset from Firebase that will get your cache up to date with the server.

    Because this is so commonly used and because it's usage depends on having knowledge of the _last time_ this query
    was run, this plugin allows you to leave off the `timestamp` property and it will manage all of this for you by
    storing all _since_-dates in a cookie (on a per model basis).

Both **Query** and **Discrete** signatures are important and together provide a powerful means to get data into your
Vuex store which transparently leverages a multi-level caching strategy. Let's conclude this section with another quick
example:

```typescript
import { since, where } from 'vuex-plugin-firemodel';
import { getProducts, getCompany, getUserProfile, getOrders } from '@/store';

async onConnect() {
  await Promise.all([
    getProducts(since())
    getCompany('12345')
  ]);
}

async onLogin({ uid }) {
  await Promise.all([
    getUserProfile(uid),
    getOrders(where('customer', uid))
  )
}
```

This example illustrates the use of both types of queries while also recognizing under which lifecycle event these types
of data should be gathered. It also shows a good practice in parallelizing requests that can be done in parallel.

### Watching what we Get

To take full advantage of a real-time database we must be able to setup "watchers" in a way that makes sense and that is
in partnership with the more request/response mechanisms of _getting_. Why is that we emphasize the importance of the
_partnership_ between _getting_ and _watch_? Why would we do both? The short answer is that, while many records in the
database are useful context for our application, in most apps the vast majority of the data is no longer "active" or
"changing". This leads to two conclusions:

1. **Watcher Value:** there is limited to no value in watching a record which has completed it's workflow and will no
   longer change
2. **Watcher Cost:** while the cost of every watcher on the database is not that well known, it's unlikely to be zero
3. **Getting Visibility**: before we _get_ records we typically do not have the visibility to know if records are useful
   to watch or not. As an example, _orders_ for a given user may be of interest for our app but just looking at an array
   of foreign keys we can't tell which are orders that are actively being updated versus those which have reached a
   final state such as "complete" or "cancelled".

For this reason we recommend the get-first approach to watching in many/most cases. To do this we would simply do this:

```typescript
import { getOrders } from '@/store';

async onLogin() {
  const watch = (o: Order) => !['completed', 'cancelled'].includes(o.status)
  await getOrders( where('customer', uid), { watch } )
}
```

There are situations, however, where we _will_ want to just jump right into a watching stance. Continuing our example
from above, we will likely want to watch not only those orders in an "active state" but also any new orders. In this
case we can just use the standard Firebase API:

```typescript
import { getOrders } from '@/store';

async onLogin() {
  const watch = (o: Order) => !['completed', 'cancelled'].includes(o.status);
  await getOrders( where('customer', uid), { watch }) );
  await Watch.list.since(new Date.getTime()).start();
}
```

However, because this pattern of watching _some_ ID's but also being interested in new records, we do also include the
following option:

```typescript
import { getOrders } from '@/store';

async onLogin() {
  const watch = (o: Order) => !['completed', 'cancelled'].includes(o.status)
  await getOrders( where('customer', uid), { watch, watchNew: true }) )
}
```

Watching is an important aspect to getting good use of Firebase and the ABC API provides helpful shortcuts where it can.
Note that the examples you've seen here are examples of using the _options_ dictionary which the get-based API's
provide. There will be more on that topic in the next section.

### The Request Signature

As was evidenced in the configuration section, the `get` and `load` symbols are higher-order functions where the first
call to the function is intended for configuration purposes, the second call is used by developers to actually
_get_/_load_ the data. This section will explore this second explicit call signature to understand what can be done
beyond just the examples we've seen so far.

So, without further ado, here are the two call signatures you'll find:

```typescript
// for discrete requests
type IAbcDiscreteRequest = (pks: (IPrimaryKey<T>)[], options?: IAbcOptions)
// for query requests
type IAbcQueryRequest = (query: IAbcQueryHelper, options?: IAbcOptions)
```

In the prior section we saw the use of the `watch` option but here is the full list of options provided by `get` and
`load` calls:

- **`watch`**

  As described in the prior section; this allows you to filter down the resulting records to a the subset that you'd
  like to watch.

  ```typescript
  const watch = (o: Order) => !['completed', 'cancelled'].includes(o.status)
  await loadOrders( since(), { watch }) )
  ```

- **`watchNew`**

  While we talked about watching after a get/load event; often this achieves only part of our intended goal. We _have_
  watched models which are "active" but we're _not watching_ for NEW records. This can be achieved by simply turning on
  this boolean switch.

  ```typescript
  await loadOrders(since(), { watchNew: true });
  ```

  When activated this plugin will start a watcher called `new-[`_`model`_`]-watch`; if a watcher with this name already
  exists it will skip creating another one (as it would always be redundant).

  > **Note:** this watcher created by this option has nothing to do with the _scope_ of the query/primary keys in the
  > first parameter slot. This means that it often will contextually make more sense with a "load" event then a "get"
  > event (although this option is available in both APIs).

- **`force`**

  If force is set to `true` then the get/load request always asks Firebase regardless if the records exist in Vuex
  and/or IndexedDB. The `get` command will still returns it's promise when

  **Note:** this overloads all "strategy" settings.

## Create, Update, and Delete

We discussed the ABC API and we've only mentioned _getting_ data not writing it. We might consider at some point in the
future adding `add`, `update` and `remove` API's but it really isn't needed at the moment. If you want to change data in
any way you just use the **Firemodel** API to make the change and it will then flow through the system in the
appropriate manner. This _includes_ updating the IndexedDB once the server has confirmed the change.

Hopefully this is clear but if not please dig into the next section about the Firemodel API.

:: align center This is a test ::
