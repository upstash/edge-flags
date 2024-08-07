# Environments

When you create a new flag, it will always be created in all 3 environments:
`production`, `preview` and `development`. You can then toggle the flag and set
rules for each environment individually.

Changing rules in one environment does not affect the other environments. This
allows you to test your feature for example in the `preview` environment before
enabling it in `production`.

The context menu in the top right corner allows you to copy rules from one
environment to another. This will overwrite the rules in the target environment,
please be careful.

![Context](/img/edge-flags/context.png)

## Using environments

<Note>
  If you deploy to Vercel, the SDK will automatically detect the environment and
  use the correct flag.
</Note>

When you use the SDK in your application, you can manually specify the
environment you want to use:

```ts
// /api/edge-flags.ts
import { createEdgeHandler } from "@upstash/edge-flags";

export default createEdgeHandler({
  // ... omitted for brevity
  environment: "preview",
});

// ...
```

If you do not specify an environment, the SDK will try to figure out the
environment based on the `VERCEL_ENV` environment variable. If it is neither
specified nor `VERCEL_ENV` is set, it will default to `development`.
