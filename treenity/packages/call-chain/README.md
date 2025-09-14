# Call Chain

A TypeScript library for elegant handling of deeply nested asynchronous method chains with built-in caching and React hooks support.

## Features

- Type-safe chaining of async and sync methods
- Automatic promise resolution
- Built-in LRU caching
- React hooks integration with SWR
- Fallback handling for undefined properties
- Mapping and transformation utilities

## Installation

```bash
npm install @treenity/call-chain
```

## Basic Usage

Call Chain allows you to chain async and sync methods seamlessly:

```ts
const api = chainCall({
  user: async (id: string) => ({ 
    id, 
    name: 'John',
    posts: async () => [{ id: 1, title: 'Hello' }]
  })
});

// Chain calls
const result = await api.user('123').posts();
```

## Caching

Built-in LRU caching is enabled by default:

```ts
const api = createCallChain({
  user: async (id: string) => ({ id, name: 'John' }),
}, {
  cache: {
    max: 100, // Maximum cache size
    ttl: 5000, // Time to live in milliseconds
    prefix: 'my-app', // Optional cache key prefix
    serialize: JSON.stringify, // Custom serialization function
    deserialize: JSON.parse // Custom deserialization function
  }
});
```

## React Integration

Use with React components via the provided hooks:

```tsx
function UserProfile({ userId }) {
  // Uses SWR under the hood for data fetching and caching
  const { data, error, isLoading, mutate } = api.user(userId).$use();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>User: {data.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

## Advanced Features

### Transformations

Apply transformations to chain results:

```ts
const api = chainCall({
  users: async () => [{ id: 1, name: 'John' }]
});

// Transform the users array after fetching
const verifiedUsers = await api.users().$map(users => users.map(u => ({ ...u, verified: true })));

// Chain multiple transformations
const result = await api.users()
  .$map(users => users.filter(u => u.id > 0))
  .$map(users => users.map(u => u.name));
```

### Fallback Handling

Handle undefined properties and caching gracefully:

```ts
const api = chainCall({
  user: async (id: string) => ({ id, name: 'John' }),
  async load() {
    return true;
  }
});

// Custom cache keys
const result = await api.user('123').$key('user-123');

// Handle undefined values
const fallback = await api.nonexistentMethod?.$default('fallback value');
```

### Library Extension

The library can be extended through mixins to add custom functionality:
1. Define your mixin functions
2. Add them to CallChainMixins
3. Declare the types in the module declaration
```ts
// Define mixin functions
// Add to CallChainMixins
defineMixin(  
  _$uppercase_(this: ChainState): string {
    return String(this).toUpperCase();
  },
  async _$withTimestamp_(this: ChainState) {
    const value = await this;
    return {
      data: value,
      timestamp: Date.now()
    };
  }
);

// Declare types
declare module '@treenity/call-chain' {
  export interface CallChainMixins<T> {
    $uppercase(): string;
    $withTimestamp(): Promise<{ data: T; timestamp: number }>;
  }
}

// Usage
const result = await api.user('123').$withTimestamp();
```

Built-in mixins include:
- `$use()`: React hook integration with SWR for data fetching
- `$map(fn)`: Transform chain results
- `$key(key)`: Set custom cache key
- `$default(value)`: Provide fallback value
- `$invalidate()`: Invalidate cache for current chain
- `$prefetch()`: Prefetch data into cache

## Error Handling

The library provides robust error handling:

```ts
try {
  const result = await api.user('invalid-id').posts();
} catch (error) {
  if (error instanceof CallChainError) {
    console.error('Chain error:', error.message);
    console.error('Chain path:', error.chainPath);
  }
}
```

## API Reference

For detailed API documentation, please refer to the source code and tests.

## License

MIT




