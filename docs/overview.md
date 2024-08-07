# Overview

Edge Flags is a low latency feature flagging solution running at the edge and
storing data in a global Redis database. It is designed to be used with
[Next.js](https://nextjs.org) and [Vercel](https://vercel.com) but we will soon
roll out support for other popular frameworks and platforms. Let us know what
you are looking for!

You can find the Github Repository [here](https://github.com/upstash/edge-flags).

## Features

- **Global Low latency:** Flags are stored in a global Redis database and are
  evaluated at the edge.
- **Environments:** Flags have different environments to support your deployment
  process: `production`, `preview`, `development`
- **Flexible:** Flags support geo targeting, percentage based rollouts and
  custom attributes
- **Manage:** Flags can be created and managed using the SDK or the self-hosted [dashboard](https://github.com/upstash/edge-flags/tree/main/packages/dashboard).
- **Free:** Edge Flags is free to use. You only pay for the Redis database.
- **Cache:** Flags can be cached for a short period of time to reduce the
  required requests to redis, making it cheaper to use.

<br />

## Architecture

![Architecture](/img/edge-flags/simple.png)
