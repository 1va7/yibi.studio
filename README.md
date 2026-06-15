This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Production Run

This app is configured for Next.js standalone output and can run as a Node
server in a Docker container.

```bash
cp .env.example .env.production
docker build -t yibi-studio:dev .
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) after the container starts.

For production, place the container behind a reverse proxy such as nginx or
Caddy. The production code location note is `mediatyphoon:~/yibi.studio`;
server credentials and deployment operations are intentionally not stored in
Git.

Production deploys are documented in
[`docs/production-deploy.md`](docs/production-deploy.md). The standard
production path builds a `linux/amd64` image locally, pushes it to the abee
tailnet registry, and lets `mediatyphoon` pull and run the image with
`compose.prod.yml` and `docker compose up -d --no-build`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
