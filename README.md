This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Development
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

### Usage
First, download [Docker](https://www.docker.com/products/docker-desktop/).

Second, build the image:
`docker build -t solmix .`

Finally, start the container:
`docker run -d --name solmix-app -p 3000:3000 solmix`

# Solmix

An innovative tool that allows not-skilled users to create, edit, analyze, and deploy smart contracts.

**Key features**
* AI integration
* No code editing feature
* Vulnerability detection analysis
* Local deployment
* DApp wizard based on ABI
