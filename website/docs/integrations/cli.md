---
title: CLI
slug: /integrations/cli
---

With the official DiceBear CLI you can create hundreds of avatars in no time.

## Create avatars

#### List available avatars styles

```
npx dicebear create
```

### List avatar style options

```
npx dicebear create <avatar-style> --help
```

### Create avatar in SVG format

```
npx dicebear create <avatar-style>
```

### Create avatar in PNG or JPG format

```
npx dicebear create <avatar-style> --format <png|jpg>
```

### Create more than one avatar

```
npx dicebear create <avatar-style> --count <count>
```

## Information

### Show CLI version

```
npx dicebear --version
```

## Manage own avatar style (beta)

### Create new avatar style

```
npx dicebear project new <package-name>
```

### Build avatar style

```
npx dicebear project build <umd-name>
```
