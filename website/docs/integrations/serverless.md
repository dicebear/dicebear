---
title: Serverless
slug: /integrations/serverless
---

The serverless API implementation is based on [Cloudflare Workers](https://workers.cloudflare.com/) and the
[Serverless Framework](https://www.serverless.com/). A free Cloudflare Workers account contains
[100.000 free requests](https://developers.cloudflare.com/workers/platform/pricing). So just give it a try.

## Installation

### Step 1

First [register](https://dash.cloudflare.com/sign-up) on Cloudflare and
[add a domain](https://community.cloudflare.com/t/step-1-adding-your-domain-to-cloudflare/64309) to your account.

### Step 2

Checkout our repository [avatars-serverless](https://github.com/DiceBear/avatars-serverless):

```
git checkout https://github.com/DiceBear/avatars-serverless.git
```

### Step 3

Change to the project directory and copy the file `.env.dist` to `.env`:

```
cd avatars-serverless
cp .env.dist .env
```

### Step 4

Edit the new created `.env` file and enter the following data:

- **CLOUDFLARE_ACCOUNT_ID**

  1. Log in to your Cloudflare account and select your domain.
  2. On the right, look for _Account ID_ and click _Click to copy_ below the input.

- **CLOUDFLARE_ZONE_ID**

  1. Log in to your Cloudflare account and select your domain.
  2. On the right, look for _Zone ID_ and click _Click to copy_ below the input.

- **CLOUDFLARE_AUTH_KEY**

  1. Log in to your Cloudflare account and navigate to _My Profile_ =>
     _[API Tokens](https://dash.cloudflare.com/profile/api-tokens)_.
  2. On the bottom, look for _Global API Key_ and click _View_.
  3. Enter your password and click _Click to copy_ below the input.

- **CLOUDFLARE_AUTH_EMAIL** This is your account email address.

### Step 5

Install the dependencies:

```
npm install
```

### Step 6

Now you are ready to deploy the API with a simple command:

```
npm run deploy
```

### Step 7

That's it. Your API should now be available in the worldwide network of Cloudflare. Create your first avatar:

[_https://**your-domain.com**/4.5/api/male/seed.svg_](https://avatars.dicebear.com/4.5/api/male/seed.svg)
