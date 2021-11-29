// @see https://github.com/parcel-bundler/parcel/issues/6071#issuecomment-981175978
const fs = require('fs');

const filePath = `${__dirname}/../dist/index.js`;
const content = fs.readFileSync(filePath, { encoding: 'UTF8' });
const [, hash] = content.match(/(\$[a-z0-9]+)\$dicebearadventurer/i);

fs.writeFileSync(
  filePath,
  content.replace(/\$[a-z0-9]+\$re_export\$([a-z]+)/gi, (...matches) => {
    return `${hash}$dicebear${matches[1].toLowerCase()}`;
  })
);
