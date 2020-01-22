# Mock DB

## Using a Mock DB

Because you are using **Firemodel**, you have the ability to start your application with a
_mocked_ database instead of a real one. This is a very powerful tool as it allows you to
create a fully isolated state machine for both a development sandbox as well as your unit
and E2E tests.

Let's say that you want to default to a mocking database if the current environment is
`dev` or if the environment variable `USE_MOCK_DB` is set:

`src/store/index.ts` (or comparable)

```typescript
const useMock = process.env.NODE_ENV === 'dev' || process.env.USE_MOCK_DB;
const config = {
  connect: useMock ? { mocking: true } : env.firebaseConfig,
  lifecycle: {
    onConnect,
    onLogin,
    ...
  }
}

const store = new Vuex.Store<IRootState>({
  // ...
  plugins: [
    FirePlugin(config)
  ]
}
```

## Starting a Mock DB with Data

While using a Mock DB that starts in a known state of "empty" is useful sometimes, it is
often more desireable to start a database with a known set of data already populated. We
can do this by leveraging the `mockData` option property and passing in either a data
structure or a callback function.

### Passing in Discrete Data

Sometimes you have defined a discrete set of data which you want to be exactly the same
every time. When you have that and want to initialize your database to that state you can
do so with:

```typescript
const useMock = process.env.NODE_ENV === 'dev' || process.env.USE_MOCK_DB;
const mockData = {
  users: {
    "1234": {
      name: "Bob"
    },
    "4567": {
      name: "Sandy"
    }
  }
}
const config = {
  connect: useMock ? { mocking: true, mockData } : env.firebaseConfig,
  lifecycle: {
    onConnect,
    onLogin,
    ...
  }
}
```

### Passing in data from a Callback

Alternatively, you may also want to define a callback which will be passed a reference to
both **Firemodel**'s `Mock()` function as well as the mock database itself. With these two
references you can either insert discrete data or mock data into the database (or both):

```typescript
const mockData = async ({ Mock, db }) => {
  db.setPath('/users/1234', { name: 'Bob' });
  await Mock(Product).generate(20);
}
const config = {
  connect: useMock ? { mocking: true, mockData } : env.firebaseConfig,
  lifecycle: {
    onConnect,
    onLogin,
    ...
  }
}

```
