# Query Helpers

Query helpers are high order functions which present the consumer an opportunity to configure the basic query definition. This definition is done at design time and fully known at run time.

At run time, we add a reference to the command (get/load) as well as the relevant `AbcApi` instance. Combining the design time and run time information, we are now able to asynchronously execute the data retrieval logic.

## Steps

```typescript
// definition    => provide run time context                               => query results
(...defn: any[]) => async (command: AbcRequestCommand, context: AbcApi<T>) => Promise<AbcResult<T>>
```
