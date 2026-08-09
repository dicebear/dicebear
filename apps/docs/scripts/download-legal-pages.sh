#!/bin/bash
#
# The legal notice lives in the private dicebear/legal repository. The page in
# this repository is a stub with nothing but frontmatter, so a failed download
# would deploy a site whose legal notice is empty. Every failure below is fatal
# for that reason, which matters most on the scheduled run, where nobody is
# watching the log.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

if [ -z "${PAT:-}" ]; then
  echo "PAT is empty. Cannot download the legal notice." >&2
  exit 1
fi

echo "Download legal notice pages"

TARGET="${DIR}/../pages/legal/legal-notice/index.md"
TMP="$(mktemp)"
trap 'rm -f "${TMP}"' EXIT

# Written to a temporary file and moved into place afterwards, so a failed run
# leaves the checkout untouched instead of truncating the target. --retry
# covers timeouts and 5xx; an authentication failure is not retried.
curl --fail --silent --show-error \
  --retry 3 --retry-delay 5 \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/site-notice.md \
  -o "${TMP}"

if [ ! -s "${TMP}" ]; then
  echo "Downloaded legal notice is empty." >&2
  exit 1
fi

mv "${TMP}" "${TARGET}"
