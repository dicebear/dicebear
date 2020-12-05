import got from 'got';
import stream from 'stream';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import { Options } from '../types';
import ora from 'ora';
import prettyBytes from 'pretty-bytes';

const pipeline = promisify(stream.pipeline);

export function stats(options: Options) {
  return async () => {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    const month = date.getMonth() + 1;
    const day = ('00' + date.getDate()).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    const yesterday = `${month}-${day}-${year}`;
    const filepath = path.join(__dirname, '../../.tmp', `${yesterday}.log`);

    if (false === (await fs.pathExists(filepath))) {
      const downloadSpinner = ora('Downloading log file. This may take a while.').start();

      await fs.ensureFile(filepath);

      await pipeline(
        got
          .stream(`https://logging.bunnycdn.com/${yesterday}/${process.env.BUNNYCDN_PULL_ZONE_ID}.log?download=true`, {
            headers: {
              AccessKey: process.env.BUNNYCDN_API_KEY,
            },
          })
          .on('downloadProgress', (progress) => {
            //console.log(progress);
          }),
        fs.createWriteStream(filepath)
      );
    }
  };
}
