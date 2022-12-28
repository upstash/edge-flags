<div align="center">
    <h1 align="center">Edge Flags</h1>
    <h5>Low latency feature flags at the edge</h5>
</div>

<div align="center">
  <a href="https://edge-flags.vercel.app/">edge-flags.vercel.app</a>
</div>
<br/>

TODO: Add description

## Powered by

- [Upstash Global Redis Database](https://docs.upstash.com/redis/features/globaldatabase)
- [Next.js](https://nextjs.org)
- [Vercel](https://vercel.com)

<br/>

![Arch](img/arch.png)

## Quickstart

0. Go to
   [console.upstash.com/edge-flags](https://console.upstash.com/edge-flags) and
   create a flag TODO: Add screenshot

1. Install `@upstash/edge-flags` in your project

```bash
npm install @upstash/edge-flags
```

2. Create an edge function in your project

```ts
// /api/edge-flags.ts
import { createEdgeHandler } from "@upstash/edge-flags";

export default createEdgeHandler({
  cacheMaxAge: 60, // cache for 60 seconds
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!, // omit to load from env automatically
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!, // omit to load from env automatically
});

/**
 * Edge flags only works on edge functions, it will break if you do not set the runtime
 */
export const config = {
  runtime: "experimental-edge",
};
```

3. Add middleware

```ts
// /middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { edgeFlagsMiddleware } from "@upstash/edge-flags";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname === "/api/edge-flags") {
    return await edgeFlagsMiddleware(req, { userId: req.ip ?? "unknown" });
  }

  return NextResponse.next();
}
```

4. Query the flag in your frontend

```tsx
// /app/index.tsx
import { useFlag } from "@upstash/edge-flags";

const { isEnabled, isLoading, error } = useFlag("flag-name");

if (error) return <div>Error: {error}</div>;
if (isLoading) return <div>Loading...</div>;

return <div>Is my feature enabled: {isEnabled}</div>;
```

## Custom attributes

`useFlag` accepts an optional object that can be used to pass custom attributes
to be evaluated in the flag rules.

```tsx
const attributes: Record<string, string> = {
  userId: "chronark",
  role: "admin",
};

useFlag("flag-name", attributes);
```

## Development

This monorepo is managed by turborepo and uses `pnpm` for dependency management.

#### Install dependencies

```bash
pnpm install
```

#### Build

```bash
pnpm build
```

## Database Schema

All configuration is stored in Redis `String` data types. Each flag is
accessible through a key like

```
STRING
edge-flags:{TENANT}:flags:{FLAG_NAME}:{ENVIRONMENT}
```

In addition to the flags, there will be a single set that contains all the flag IDs. We can not guarantee the database is only used for edge-flags so we need to keep track of the flags we have created instead of using a potentially expensive
`SCAN` operation.

```
SET 
edge-flags:{TENANT}:flags
```

- `TENANT` is currently unused (set as `default`) but reserved for future use.
  ie for managing multiple projects int a single database
- `FLAG_NAME` is the unique identifier for the flag
- `ENVIRONMENT` is the environment the flag is targeting. ie `production`,
  `preview`, `development`

### Packages

- **/packages/sdk:** The SDK to be imported into your project
- **/examples/nextjs:** An example Next.js app using the SDK

## Authors

This project was originally created by

- [@ademilter](https://twitter.com/ademilter)
- [@chronark_](https://twitter.com/chronark_)
- [@enesakar](https://twitter.com/enesakar)
