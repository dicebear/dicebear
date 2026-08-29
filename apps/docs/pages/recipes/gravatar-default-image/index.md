---
title: DiceBear as Gravatar Default Avatar
description: >
  Use DiceBear's avatar API as a privacy-focused Gravatar fallback image. Simple
  URL-based integration with no authentication required.
---

# DiceBear as Gravatar default avatar

Gravatar shows a default image for everyone without a Gravatar account, and
you can point it at the DiceBear HTTP API, so those people get a friendly
generated avatar instead of the gray silhouette. Gravatar sets a few
conditions for default images:

> 1. ✅ MUST be publicly available (e.g. cannot be on an intranet, on a local
>    development machine, behind HTTP Auth or some other firewall etc). Default
>    images are passed through a security scan to avoid malicious content.
> 2. ✅ MUST be accessible via HTTP or HTTPS on the standard ports, 80 and 443,
>    respectively.
> 3. ⚠️ MUST have a recognizable image extension (jpg, jpeg, gif, png, heic)
> 4. ⚠️ MUST NOT include a querystring (if it does, it will be ignored)

> Source: https://docs.gravatar.com/sdk/images/#default-image

Since Gravatar does not support SVG, we have to use the PNG endpoint.

::: code-group

<!-- prettier-ignore -->
```js [JavaScript]
const emailHash = encodeURIComponent('00000000000000000000000000000000');
const defaultImage = encodeURIComponent(
  'https://api.dicebear.com/10.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png' // [!code ++]
);

const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```php [PHP]
$emailHash = urlencode('00000000000000000000000000000000');
$defaultImage = urlencode(
  'https://api.dicebear.com/10.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png' // [!code ++]
);

$gravatarImage = sprintf(
  'https://www.gravatar.com/avatar/%s?d=%s',
  $emailHash,
  $defaultImage
);
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```python [Python]
import urllib.parse

email_hash = urllib.parse.quote("00000000000000000000000000000000")
default_image = urllib.parse.quote(
    "https://api.dicebear.com/10.x/lorelei/svg"  # [!code --]
    "https://api.dicebear.com/10.x/lorelei/png"  # [!code ++]
)

gravatar_image = f"https://www.gravatar.com/avatar/{email_hash}?d={default_image}"
# https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```go [Go]
import (
	"fmt"
	"net/url"
)

emailHash := url.QueryEscape("00000000000000000000000000000000")
defaultImage := url.QueryEscape(
	"https://api.dicebear.com/10.x/lorelei/svg", // [!code --]
	"https://api.dicebear.com/10.x/lorelei/png", // [!code ++]
)

gravatarImage := fmt.Sprintf("https://www.gravatar.com/avatar/%s?d=%s", emailHash, defaultImage)
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```dart [Dart]
final emailHash = Uri.encodeComponent('00000000000000000000000000000000');
final defaultImage = Uri.encodeComponent(
  'https://api.dicebear.com/10.x/lorelei/svg' // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png' // [!code ++]
);

final gravatarImage = 'https://www.gravatar.com/avatar/$emailHash?d=$defaultImage';
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

<!-- prettier-ignore -->
```csharp [C#]
var emailHash = Uri.EscapeDataString("00000000000000000000000000000000");
var defaultImage = Uri.EscapeDataString(
    "https://api.dicebear.com/10.x/lorelei/svg" // [!code --]
    "https://api.dicebear.com/10.x/lorelei/png" // [!code ++]
);

var gravatarImage = $"https://www.gravatar.com/avatar/{emailHash}?d={defaultImage}";
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng
```

:::

Usually we set options in the query string, such as the seed. Since a query
string is not allowed by Gravatar, the [HTTP-API](/integrations/http-api/) allows
you to specify the options in the path. Just replace the question mark with a
slash and encode the options.

::: code-group

```js [JavaScript]
const emailHash = encodeURIComponent('00000000000000000000000000000000');
const options = `seed=${emailHash}`;
const defaultImage = encodeURIComponent(
  `https://api.dicebear.com/10.x/lorelei/png?${options}` // [!code --]
  `https://api.dicebear.com/10.x/lorelei/png/${encodeURIComponent(options)}`, // [!code ++]
);

const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```php [PHP]
$emailHash = urlencode('00000000000000000000000000000000');
$options = sprintf('seed=%s', $emailHash);
$defaultImage = urlencode(
  'https://api.dicebear.com/10.x/lorelei/png?' . $options // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png/' . urlencode($options) // [!code ++]
);

$gravatarImage = sprintf(
  'https://www.gravatar.com/avatar/%s?d=%s',
  $emailHash,
  $defaultImage
);
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```python [Python]
import urllib.parse

email_hash = urllib.parse.quote("00000000000000000000000000000000")
options = f"seed={email_hash}"
default_image = urllib.parse.quote(
    f"https://api.dicebear.com/10.x/lorelei/png?{options}"  # [!code --]
    f"https://api.dicebear.com/10.x/lorelei/png/{urllib.parse.quote(options)}"  # [!code ++]
)

gravatar_image = f"https://www.gravatar.com/avatar/{email_hash}?d={default_image}"
# https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```go [Go]
import (
	"fmt"
	"net/url"
)

emailHash := url.QueryEscape("00000000000000000000000000000000")
options := fmt.Sprintf("seed=%s", emailHash)
defaultImage := url.QueryEscape(
	fmt.Sprintf("https://api.dicebear.com/10.x/lorelei/png?%s", options), // [!code --]
	fmt.Sprintf("https://api.dicebear.com/10.x/lorelei/png/%s", url.QueryEscape(options)), // [!code ++]
)

gravatarImage := fmt.Sprintf("https://www.gravatar.com/avatar/%s?d=%s", emailHash, defaultImage)
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```dart [Dart]
final emailHash = Uri.encodeComponent('00000000000000000000000000000000');
final options = 'seed=$emailHash';
final defaultImage = Uri.encodeComponent(
  'https://api.dicebear.com/10.x/lorelei/png?$options' // [!code --]
  'https://api.dicebear.com/10.x/lorelei/png/${Uri.encodeComponent(options)}' // [!code ++]
);

final gravatarImage = 'https://www.gravatar.com/avatar/$emailHash?d=$defaultImage';
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

<!-- prettier-ignore -->
```csharp [C#]
var emailHash = Uri.EscapeDataString("00000000000000000000000000000000");
var options = $"seed={emailHash}";
var defaultImage = Uri.EscapeDataString(
    $"https://api.dicebear.com/10.x/lorelei/png?{options}" // [!code --]
    $"https://api.dicebear.com/10.x/lorelei/png/{Uri.EscapeDataString(options)}" // [!code ++]
);

var gravatarImage = $"https://www.gravatar.com/avatar/{emailHash}?d={defaultImage}";
// https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F10.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000
```

:::
