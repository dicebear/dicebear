---
title: Self-Hosted Avatar API – Host DiceBear Yourself
description: >
  Self-host the DiceBear avatar API for privacy-by-design and commercial use.
  Docker and Node.js deployment options available.
---

# Self-hosted avatar API: host DiceBear yourself

The public HTTP API is free and needs no signup, and for most projects that is
all you ever use. Hosting it yourself becomes interesting when avatar requests
should stay on your own infrastructure, be it for data control, for your own
rate limits, or because your app runs in a closed network. The source code is on
[GitHub](https://github.com/dicebear/api).

## With Docker

The easiest way is the [Docker image](https://hub.docker.com/r/dicebear/api):

```sh
docker run --tmpfs /run --tmpfs /tmp -p 3000:3000 -i -t dicebear/api:4
```

Or configure it in a `docker-compose.yml` and start it with `docker compose up`:

```yaml
services:
  dicebear:
    image: dicebear/api:4
    restart: always
    ports:
      - '3000:3000'
    tmpfs:
      - '/run'
      - '/tmp'
```

## Without Docker

You can also run the HTTP API directly on your machine with
[Node.js](https://nodejs.org/):

```sh
git clone git@github.com:dicebear/api.git
cd api

npm install
npm run build
npm start
```

## Optional style metadata endpoints

Your instance can expose two metadata endpoints per style. Both are off by
default, and an environment variable turns each one on:

```http
http://localhost:3000/11.x/<styleName>/definition.json
http://localhost:3000/11.x/<styleName>/options.json
```

- `definition.json` returns the raw
  [style definition](/create-styles/from-scratch/), the same JSON the styles
  package ships. Enable it with `DEFINITION=1`.
- `options.json` describes all options the style accepts: field types, allowed
  enum values, and value ranges. It leaves out the options in
  `EXCLUDED_OPTIONS`, so it always matches what your instance accepts. Enable it
  with `OPTIONS=1`.

Both responses are cached according to `CACHE_CONTROL_STYLES`.

## Signed URLs

By default, anyone who can reach your instance can request any avatar. Set
`SIGNING_SECRETS` and the avatar endpoints answer an unsigned or wrongly signed
URL with a `403`. Requests the API turns down before it gets to the signature
keep their usual answer, such as a `404` for an unknown style or a `400` for too
many parameters. The health check, the style listing and the metadata endpoints
stay open.

The signature is the HMAC-SHA256 of the path and query string, hex encoded and
appended as the `sig` parameter. Encode each value before you sign, because the
browser sends `Zoë` as `Zo%C3%AB` and the API checks the encoded form. List
values stay separated by plain commas:

::: code-group

```js [JavaScript]
import { createHmac } from 'node:crypto';

// Browsers send ' in a query string as %27, encodeURIComponent leaves it.
const encode = (value) => encodeURIComponent(value).replace(/'/g, '%27');

function signedAvatarUrl(path, options, secret) {
  const query = Object.entries(options)
    .map(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];

      return `${key}=${values.map(encode).join(',')}`;
    })
    .join('&');

  const url = query ? `${path}?${query}` : path;
  const sig = createHmac('sha256', secret).update(url).digest('hex');

  return `${url}${query ? '&' : '?'}sig=${sig}`;
}

signedAvatarUrl(
  '/11.x/thumbs/svg',
  { seed: 'Zoë', backgroundColor: ['b6e3f4', 'c0aede'] },
  '0123456789abcdef0123456789abcdef',
);
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

<!-- prettier-ignore -->
```php [PHP]
function signedAvatarUrl(string $path, array $options, string $secret): string
{
    $query = [];

    foreach ($options as $key => $value) {
        $query[] = $key . '=' . implode(',', array_map('rawurlencode', (array) $value));
    }

    $url = $query ? $path . '?' . implode('&', $query) : $path;
    $sig = hash_hmac('sha256', $url, $secret);

    return $url . ($query ? '&' : '?') . 'sig=' . $sig;
}

signedAvatarUrl(
    '/11.x/thumbs/svg',
    ['seed' => 'Zoë', 'backgroundColor' => ['b6e3f4', 'c0aede']],
    '0123456789abcdef0123456789abcdef'
);
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

<!-- prettier-ignore -->
```python [Python]
import hashlib
import hmac
from urllib.parse import quote


def signed_avatar_url(path: str, options: dict, secret: str) -> str:
    parts = []

    for key, value in options.items():
        values = value if isinstance(value, list) else [value]
        parts.append(f"{key}={','.join(quote(str(v), safe='') for v in values)}")

    query = "&".join(parts)
    url = f"{path}?{query}" if query else path
    sig = hmac.new(secret.encode(), url.encode(), hashlib.sha256).hexdigest()

    return f"{url}{'&' if query else '?'}sig={sig}"


signed_avatar_url(
    "/11.x/thumbs/svg",
    {"seed": "Zoë", "backgroundColor": ["b6e3f4", "c0aede"]},
    "0123456789abcdef0123456789abcdef",
)
# /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

<!-- prettier-ignore -->
```rust [Rust]
// Cargo.toml: hex = "0.4", hmac = "0.12", sha2 = "0.10", urlencoding = "2"
use hmac::{Hmac, Mac};
use sha2::Sha256;

fn signed_avatar_url(path: &str, options: &[(&str, &[&str])], secret: &str) -> String {
    let query = options
        .iter()
        .map(|(key, values)| {
            let values: Vec<_> = values.iter().map(|value| urlencoding::encode(value)).collect();

            format!("{key}={}", values.join(","))
        })
        .collect::<Vec<_>>()
        .join("&");

    let url = if query.is_empty() {
        path.to_string()
    } else {
        format!("{path}?{query}")
    };

    let mut mac = Hmac::<Sha256>::new_from_slice(secret.as_bytes()).unwrap();
    mac.update(url.as_bytes());
    let sig = hex::encode(mac.finalize().into_bytes());

    format!("{url}{}sig={sig}", if query.is_empty() { '?' } else { '&' })
}

signed_avatar_url(
    "/11.x/thumbs/svg",
    &[("seed", &["Zoë"]), ("backgroundColor", &["b6e3f4", "c0aede"])],
    "0123456789abcdef0123456789abcdef",
);
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

<!-- prettier-ignore -->
```go [Go]
import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/url"
	"strings"
)

type Option struct {
	Key    string
	Values []string
}

func signedAvatarURL(path string, options []Option, secret string) string {
	parts := make([]string, len(options))

	for i, option := range options {
		values := make([]string, len(option.Values))

		for j, value := range option.Values {
			// QueryEscape writes a space as "+", the API expects "%20".
			values[j] = strings.ReplaceAll(url.QueryEscape(value), "+", "%20")
		}

		parts[i] = option.Key + "=" + strings.Join(values, ",")
	}

	signed, separator := path, "?"

	if len(parts) > 0 {
		signed, separator = path+"?"+strings.Join(parts, "&"), "&"
	}

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(signed))

	return signed + separator + "sig=" + hex.EncodeToString(mac.Sum(nil))
}

signedAvatarURL(
	"/11.x/thumbs/svg",
	[]Option{
		{"seed", []string{"Zoë"}},
		{"backgroundColor", []string{"b6e3f4", "c0aede"}},
	},
	"0123456789abcdef0123456789abcdef",
)
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

<!-- prettier-ignore -->
```dart [Dart]
// pubspec.yaml: crypto: ^3.0.0
import 'dart:convert';

import 'package:crypto/crypto.dart';

// Browsers send ' in a query string as %27, Uri.encodeComponent leaves it.
String encode(String value) =>
    Uri.encodeComponent(value).replaceAll("'", '%27');

String signedAvatarUrl(
  String path,
  Map<String, List<String>> options,
  String secret,
) {
  final query = options.entries
      .map((option) => '${option.key}=${option.value.map(encode).join(',')}')
      .join('&');

  final url = query.isEmpty ? path : '$path?$query';
  final sig = Hmac(sha256, utf8.encode(secret)).convert(utf8.encode(url));

  return '$url${query.isEmpty ? '?' : '&'}sig=$sig';
}

signedAvatarUrl(
  '/11.x/thumbs/svg',
  {
    'seed': ['Zoë'],
    'backgroundColor': ['b6e3f4', 'c0aede'],
  },
  '0123456789abcdef0123456789abcdef',
);
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

<!-- prettier-ignore -->
```csharp [C#]
using System.Security.Cryptography;
using System.Text;

static string SignedAvatarUrl(
    string path,
    IEnumerable<KeyValuePair<string, string[]>> options,
    string secret)
{
    var query = string.Join("&", options.Select(option =>
        $"{option.Key}={string.Join(",", option.Value.Select(Uri.EscapeDataString))}"));

    var url = query.Length > 0 ? $"{path}?{query}" : path;
    var hash = HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(url));
    var sig = Convert.ToHexString(hash).ToLowerInvariant();

    return $"{url}{(query.Length > 0 ? "&" : "?")}sig={sig}";
}

SignedAvatarUrl(
    "/11.x/thumbs/svg",
    new Dictionary<string, string[]>
    {
        ["seed"] = ["Zoë"],
        ["backgroundColor"] = ["b6e3f4", "c0aede"],
    },
    "0123456789abcdef0123456789abcdef");
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

:::

- With the options in the query string, the API checks the URL exactly as it
  arrives. `sig` has to be the last parameter, in lowercase hex, and everything
  in front of it is the signed string. If a proxy in front of the API rewrites
  the path, sign the path the API receives.
- URLs that carry the options in the path, as in the
  [Gravatar recipe](/recipes/gravatar-default-image/), keep `sig` and `exp` in
  that path segment too, because Gravatar drops a query string. Sign the path
  with its options before you encode the segment, for example
  `/11.x/lorelei/png/seed=Zo%C3%AB&exp=1794850233`. Then append `&sig=…` and
  encode the segment as a whole. Such a URL must not have a query string. With
  one, even a correctly signed URL gets a `403` with
  `Query string not allowed next to path options.`
- A `#` in a value has to arrive as `%23`. The examples above encode it. A URL
  with a raw `#` gets a `403`.
- Every secret needs at least 32 characters, and the API refuses to start with a
  shorter one. `openssl rand -hex 32` generates a random one. A short or
  guessable secret can be found by trial and error from a single signed URL.
- An optional `exp` parameter holds a Unix timestamp in seconds. From that
  moment on the URL returns a `403`. Add it next to the other options before
  signing, so the signature covers it. The `max-age` in `Cache-Control` is
  capped at the time that remains.
- `exp` must appear once and hold 1 to 10 digits. `Date.now()` returns
  milliseconds, so divide by 1000. A repeated `exp` or one in another format
  gets a `403` with `Invalid expiry.`
- `SIGNING_SECRETS` takes several secrets separated by commas, with spaces
  around each one trimmed, so a secret cannot contain a comma. Without the
  variable, or with an empty one, the API runs without signed URLs.
- The API accepts a signature made with any of the secrets. To rotate, add the
  new secret, switch your application to it and remove the old one once its URLs
  are no longer in use.
- Removing a secret does not purge responses that a CDN or a browser has already
  cached.
- Sign on your server. A secret that ships to a browser or a mobile app can be
  read by anyone.

## Environment variables

| Variable                           | Default                                       | Description                                                          |
| ---------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `PORT`                             | `3000`                                        | Port to listen on.                                                   |
| `HOST`                             | `0.0.0.0`                                     | Host to bind to (all IPv4 addresses by default).                     |
| `LOGGER`                           | `0`                                           | Enable request logger (1 = on, 0 = off).                             |
| `WORKERS`                          | `1`                                           | Number of Node.js worker threads.                                    |
| `VERSIONS`                         | `10,11`                                       | Comma-separated list of supported DiceBear major versions.           |
| `CACHE_CONTROL_AVATARS`            | `31536000`                                    | Cache duration for avatar responses in seconds (1 year).             |
| `CACHE_CONTROL_STYLES`             | `3600`                                        | Cache duration for the styles listing in seconds (1 hour).           |
| `{FORMAT}`                         | `1`                                           | Enable the endpoint of this raster format (1 = on, 0 = off).         |
| `{FORMAT}_SIZE_MIN`                | `1`                                           | Minimum allowed size in px.                                          |
| `{FORMAT}_SIZE_MAX`                | `256`                                         | Maximum allowed size in px.                                          |
| `{FORMAT}_SIZE_DEFAULT`            | `128`                                         | Default size in px.                                                  |
| `{FORMAT}_EXIF`                    | `1`                                           | Enable Exif metadata (1 = on, 0 = off).                              |
| `JSON`                             | `1`                                           | Enable the JSON endpoint (1 = on, 0 = off).                          |
| `DEFINITION`                       | `0`                                           | Enable the per-style `definition.json` endpoint (1 = on, 0 = off).   |
| `OPTIONS`                          | `0`                                           | Enable the per-style `options.json` endpoint (1 = on, 0 = off).      |
| `INITIALS_FILTER`                  | `1`                                           | Replace blocked text in rendered avatars with `*` (1 = on, 0 = off). |
| `QUERY_STRING_ARRAY_LIMIT_MIN`     | `20`                                          | Minimum number of values allowed per array parameter.                |
| `EXCLUDED_OPTIONS`                 | `idRandomization,fontFamily,fontWeight,title` | Comma-separated list of option names to exclude.                     |
| `QUERY_STRING_PARAMETER_LIMIT_MIN` | `100`                                         | Minimum number of query string parameters allowed.                   |
| `SIGNING_SECRETS`                  |                                               | Comma-separated secrets for [signed URLs](#signed-urls).             |

`{FORMAT}` stands for `PNG`, `JPEG`, `WEBP`, or `AVIF`, so `PNG_SIZE_MAX` sets
the largest PNG and `AVIF=0` turns the AVIF endpoint off.
