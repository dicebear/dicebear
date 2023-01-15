import { toFormat } from '../lib/node/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { test } from 'uvu';
import { not } from 'uvu/assert';

const __dirname = new URL('.', import.meta.url).pathname;
const avatar = fs.readFileSync(path.resolve(__dirname, 'fixtures/avatar.svg'), {
  encoding: 'utf8',
});

test(`Convert to jpeg buffer`, async () => {
  not.throws(() => toFormat(avatar, 'jpeg').toArrayBuffer());
});

test(`Convert to jpeg data uri`, async () => {
  not.throws(() => toFormat(avatar, 'jpeg').toDataUri());
});

test.run();
