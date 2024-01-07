import { toPng } from '../lib/node/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { test } from 'uvu';
import { not } from 'uvu/assert';

const __dirname = new URL('.', import.meta.url).pathname;
const avatar = fs.readFileSync(path.resolve(__dirname, 'fixtures/avatar.svg'), {
  encoding: 'utf8',
});

test(`Convert to png buffer`, async () => {
  not.throws(() => toPng(avatar).toArrayBuffer());
});

test(`Convert to png data uri`, async () => {
  not.throws(() => toPng(avatar).toDataUri());
});

test.run();
