#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "Download legal pages"

curl \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/site-notice.md \
  > "${DIR}/../docs/legal/site-notice/index.md"

curl \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/privacy-policy.md \
  > "${DIR}/../docs/legal/privacy-policy/index.md"

curl \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/de/site-notice.md \
  > "${DIR}/../docs/legal/site-notice/de/index.md"

curl \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/de/privacy-policy.md \
  > "${DIR}/../docs/legal/privacy-policy/de/index.md"
