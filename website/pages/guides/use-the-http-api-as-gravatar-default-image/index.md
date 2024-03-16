# Use the HTTP-API as Gravatar default image

You can use the HTTP API of DiceBear as Gravatar default image. But before that,
let's take a look at the conditions for Gravatar default images:

> 1. ✅ MUST be publicly available (e.g. cannot be on an intranet, on a local
>    development machine, behind HTTP Auth or some other firewall etc). Default
>    images are passed through a security scan to avoid malicious content.
> 2. ✅ MUST be accessible via HTTP or HTTPS on the standard ports, 80 and 443,
>    respectively.
> 3. ⚠️ MUST have a recognizable image extension (jpg, jpeg, gif, png)
> 4. ⚠️ MUST NOT include a querystring (if it does, it will be ignored)

> Source: https://de.gravatar.com/site/implement/images/

Since Gravatar does not support SVG, we have to use the PNG endpoint.

::: code-group

<!-- prettier-ignore -->
```js [JavaScript]
const emailHash = encodeURIComponent('00000000000000000000000000000000');
const defaultImage = encodeURIComponent(
  'https://api.dicebear.com/8.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/8.x/lorelei/png' // [!code ++]
);

const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F8.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```php [PHP]
$emailHash = urlencode('00000000000000000000000000000000');
$defaultImage = urlencode(
  'https://api.dicebear.com/8.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/8.x/lorelei/png' // [!code ++]
);

$gravatarImage = sprintf(
  'https://www.gravatar.com/avatar/%s?d=%s',
  $emailHash,
  $defaultImage
);
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F8.x%2Florelei%2Fpng
```

:::

Usually we set options in the query string, such as the seed. Since a query
string is not allowed by Gravatar, the [HTTP-API](/how-to-use/http-api/) allows
you to specify the options in the path. Just replace the question mark with a
slash and encode the options.

::: code-group

```js [JavaScript]
const emailHash = encodeURIComponent('00000000000000000000000000000000');
const options = `seed=${emailHash}`;
const defaultImage = encodeURIComponent(
  `https://api.dicebear.com/8.x/lorelei/png?${options}` // [!code --]
  `https://api.dicebear.com/8.x/lorelei/png/${encodeURIComponent(options)}` // [!code ++]
);

const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F8.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```php [PHP]
$emailHash = urlencode('00000000000000000000000000000000');
$options = sprintf('seed=%s', $emailHash);
$defaultImage = urlencode(
  'https://api.dicebear.com/8.x/lorelei/png?' . $options // [!code --]
  'https://api.dicebear.com/8.x/lorelei/png/' . urlencode($options) // [!code ++]
);

$gravatarImage = sprintf(
  'https://www.gravatar.com/avatar/%s?d=%s',
  $emailHash,
  $defaultImage
);
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F8.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

:::
