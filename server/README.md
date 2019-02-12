# avatars.dicebear.com

Documentation and HTTP-API for [DiceBear Avatars](https://github.com/DiceBear/avatars).

## Installation

### 1. Download

```
git clone https://github.com/DiceBear/avatars.dicebear.com.git
```

### 2. Installation

```
cd avatars.dicebear.com;
yarn install;
```

### 3. Start server

```
yarn build
yarn start
```

## API Routes

### Documentation / Landingpage

```
GET /
```

### Avatars v2

```
GET /v2/:spriteSet/:seed.svg
```

```
:spriteSet => male|female|identicon
:seed => string
```

Optionally `options` GET parameter with spriteSet options.

⚠️ Don't use sensitive or personal data as seed!
