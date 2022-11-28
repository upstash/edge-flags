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

#### Develop UI
  
```bash
pnpm turbo run dev --filter=web
```

### Packages

- **/packages/sdk:** The SDK to be imported into your project
- **/packages/web:** The management interface you can selfhost [Link](https://edge-flags.vercel.app)
- **/examples/nextjs:** TODO: An example Next.js app using the SDK
- **/examples/nextjs12:** TODO: Using the SDK with Next.js 12 

## Authors

This project was originally created by
- [@ademilter](https://twitter.com/ademilter)
- [@chronarkdotdev](https://twitter.com/chronarkdotdev)
- [@enesakar](https://twitter.com/enesakar)







