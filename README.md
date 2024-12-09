This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# First step run 
```bash
git clone 
```
## Requirements
# Nodejs
# Environmental variables
navigate to/create a .env/local file and add the following API keys;
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY => Obtained from Clerk js (Sign up and create a new project/application --has detailed documentation)
CLERK_SECRET_KEY => Obtained from Clerk js

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

WEBHOOK_SECRET => Obtained from Clerk Js to connect Clerk Auth and MongoDB users collection.

UPLOADTHING_SECRET => Sign up to uploadthing and spin up a new application to get the secret API key and APP_ID
UPLOADTHING_APP_ID

MONGODB_URL => Spin up a MongoDB database and get a connection string

NEXT_PUBLIC_SERVER_URL => Obtained after deploying through Vercel, not essential to run the code.


## Running the application
First, run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
