---
title: CLI
slug: /integrations/cli
---

With the official DiceBear CLI you can create hundreds of avatars in no time.

## Installation

```
npm install -g dicebear
```

## Create avatars

#### List available avatars styles

```
dicebear create --help
```

### List avatar style options

```
dicebear create <avatar-style> --help
```

### Create avatar in SVG format

```
dicebear create <avatar-style>
```

### Create avatar in PNG or JPG format

```
dicebear create <avatar-style> --format <png|jpg>
```

### Create more than one avatar

```
dicebear create <avatar-style> --count <count>
```

## Information

### Show CLI version

```
dicebear --version
```

## Manage own avatar style

### Create new avatar style

```
dicebear project new <package-name>
```

### Build avatar style

```
dicebear project build <umd-name>
```
