#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

echo "Download site notice pages"

curl \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/site-notice.md \
  > "${DIR}/../pages/legal/site-notice/index.md"

curl \
  -H "Accept: application/vnd.github.raw" \
  -H "Authorization: Bearer ${PAT}"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/dicebear/legal/contents/docs/legal/de/site-notice.md \
  > "${DIR}/../pages/legal/site-notice/de/index.md"

echo "Download privacy policy pages"

declare -a urls=(
    "https://www.iubenda.com/api/privacy-policy/80926821/no-markup"
    "https://www.iubenda.com/api/privacy-policy/57216581/no-markup"
)
declare -a filenames=(
    "${DIR}/../pages/legal/privacy-policy/de/index.md"
    "${DIR}/../pages/legal/privacy-policy/index.md"
)

for i in "${!urls[@]}"; do
    mkdir -p "$(dirname "${filenames[$i]}")"

    curl -s "${urls[$i]}" | jq -r '.content' | tr '\n' ' ' | sed 's/  */ /g' >>"${filenames[$i]}"

    if [ $? -ne 0 ]; then
        echo "Error parsing JSON object from ${urls[$i]}"
        exit 1
    fi
done
