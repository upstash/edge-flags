# Get Started

This quickstart will show you how to get started with Edge Flags in a Next.js
project.

## 1. Create a redis database

Go to [console.upstash.com/redis](https://console.upstash.com/redis) and create
a new global database.

After creating the db, copy the `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` to your `.env` file.

## 2. Create a flag

Open the self-hosted edge flags dashboard using npx in the same directory and add your database.

```bash
npx @upstash/edge-flags-dashboard
```

You can also use the hosted version at [https://edge-flags-dashboard.vercel.app](https://edge-flags-dashboard.vercel.app).

Create a new flag using the dashboard and enable it. Then you can add some rules.

![Created Flag](/img/edge-flags/flag.png)

In this case, the flag has a percentage and 2 rules. For 80% of the users the
flag will be evaluated. For the other 20% the flag will immediately return
`false` without evaluating the rules.

- The first rule is a geo targeting rule. It will enable the flag for users in
  Germany or the United Kingdom.
- The second rule is a custom attribute rule. It will enable the flag for users
  with the attribute `userId` set to `chronark`.

Rules are evaluated from top to bottom. If a rule matches, the flag will return
the configured value and stop evaluating the remaining rules.

If neither rule matches, the flag will return `false`

Make sure you have enabled the flag by clicking on the toggle button in the top
right corner.

Now lets use the flag in our Next.js project.

## 3. Install dependencies

```bash
npm install @upstash/edge-flags
```

## 4. Create an edge function in your project

```ts
// /api/edge-flags/route.ts
import { createEdgeHandler } from "@upstash/edge-flags";

export const GET = createEdgeHandler({
  cacheMaxAge: 0, // cache time in seconds, 0 disables the cache
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!, // omit to load from env automatically
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!, // omit to load from env automatically
});

export const runtime = "edge";
```

## 5. Query the flag in your frontend

```tsx
// /app/page.tsx
import { useFlag } from "@upstash/edge-flags";

export default function Example() {
  const { isEnabled, isLoading, error } = useFlag("flag-name");

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>Is my feature enabled: {isEnabled}</div>;
}
```

For more information about client side usage, see
[here](/redis/sdks/edge-flags/react).
