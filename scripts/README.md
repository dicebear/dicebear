# DiceBear Scripts

Here you can find scripts that we use to automate tasks for this repository, the API and the CDN.

## Configure

Copy the `.env.dist` to `.env` and add the credentials.

## Commands

Commands that you can execute as follows:

```
npm run <COMMAND> --workspace @dicebear/avatars-scripts
```

### cdn:clear

Deletes the website from the CDN.

### cdn:purge

Purges the CDN cache.

### cdn:stats

Outputs statistics from the CDN.

### cdn:update

Reconfigures the CDN using the `config.yml`.

### cdn:upload

Builds the website, uploads it and purges relevant paths in the CDN cache.
