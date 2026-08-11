#!/bin/bash
#
# The llms files and the Markdown mirrors depend on two Bunny.net edge rules,
# described in deploy-website.yml: text/plain with a UTF-8 charset, and
# X-Robots-Tag: noindex. The rules live in the pull zone dashboard, so no
# commit can break or fix them, and a deleted rule would ship mojibake and
# duplicate-content mirrors without a failure anywhere. This check makes the
# deploy the place where that failure shows up.
set -euo pipefail

check() {
  local url="$1"
  local headers

  # --retry covers the moment right after the pull zone purge, when an edge
  # node may still answer from a half-updated state.
  headers="$(curl --fail --silent --show-error --head \
    --retry 3 --retry-delay 5 \
    "${url}")"

  if ! grep -qi '^content-type: text/plain; charset=utf-8' <<<"${headers}"; then
    echo "${url}: expected 'Content-Type: text/plain; charset=utf-8', got:" >&2
    grep -i '^content-type:' <<<"${headers}" >&2 || echo '(no Content-Type header)' >&2
    exit 1
  fi

  if ! grep -qi '^x-robots-tag:.*noindex' <<<"${headers}"; then
    echo "${url}: the 'X-Robots-Tag: noindex' header is missing." >&2
    exit 1
  fi

  echo "${url} OK"
}

check 'https://www.dicebear.com/llms.txt'
check 'https://www.dicebear.com/llms-full.txt'
check 'https://www.dicebear.com/how-to-use/http-api/index.md'
