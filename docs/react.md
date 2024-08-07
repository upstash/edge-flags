# React Client

The `@upstash/edge-flags` package provides a React hook, you can use to query
flags in your React application.

## Installation

```bash
npm install @upstash/edge-flags
```

## Usage

Import the `useFlag` hook from the `@upstash/edge-flags` package and pass the
name of the flag you want to query.

```tsx
import { useFlag } from "@upstash/edge-flags";

const MyComponent = () => {
  const { isEnabled, loading, error } = useFlag("my-flag");

  if (error) {
    return <p>Error {error}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return <p>Flag is {isEnabled ? "enabled" : "disabled"}</p>;
};
```

## Custom Attributes

You can use custom attributes to enable a flag for a subset of users. For
example, you can identify users by `userId` or `email`.

To set attributes, you can pass an object to the `useFlag` hook.

```tsx
import { useFlag } from "@upstash/edge-flags";

const { isEnabled } = useFlag("my-flag", {
  userId: "chronark",
  email: "andreas@upstash.com",
});
```
