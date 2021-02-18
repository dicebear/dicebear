import got from 'got';
import stream from 'stream';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import prettyBytes from 'pretty-bytes';
import { throttle } from 'throttle-debounce';
import * as log from '../utils/log';
import globby from 'globby';
import mustache from 'mustache';
import open from 'open';
// @ts-ignore
import Sitemapper from 'sitemapper';

const pipeline = promisify(stream.pipeline);

type RequestCollection = Record<
  string,
  {
    error: number;
    hit: number;
    miss: number;
  }
>;

(async () => {
  // Define log path and filename.
  const [year, month, day] = new Date().toISOString().split('T')[0].split('-');

  const yesterday = `${month}-${day}-${year.slice(-2)}`;
  const tmpDir = path.join(__dirname, '../../.tmp/cdn/stats');
  const filename = `${yesterday}.log`;
  const logFilePath = path.join(tmpDir, filename);
  const statsFilePath = path.join(tmpDir, `${yesterday}.html`);

  // Remove old log files
  const removeSpinner = ora({
    prefixText: 'Remove old log files.',
  }).start();

  let oldFiles = await globby(`*`, {
    cwd: tmpDir,
    ignore: [filename],
  });

  for (let i = 0; i < oldFiles.length; i++) {
    let oldFile = oldFiles[i];

    removeSpinner.text = oldFile;

    await fs.remove(path.join(tmpDir, oldFile));
  }

  removeSpinner.stop();

  // Download log file
  if (false === (await fs.pathExists(logFilePath))) {
    const downloadSpinner = ora({
      prefixText: 'Downloading log file. This may take a while.',
    }).start();

    const updateDownloadSpinner = throttle(1000, (progress: any) => {
      downloadSpinner.text = prettyBytes(progress.transferred);
    });

    await fs.ensureFile(logFilePath);

    await pipeline(
      got
        .stream(
          `https://logging.bunnycdn.com/${yesterday}/${process.env.BUNNYCDN_PULL_ZONE_ID}.log?download=true&status=100,200,400,500`,
          {
            headers: {
              AccessKey: process.env.BUNNYCDN_API_KEY,
            },
          }
        )
        .on('downloadProgress', (progress) => {
          updateDownloadSpinner(progress);
        }),
      fs.createWriteStream(logFilePath)
    );

    downloadSpinner.stop();
  }

  // Collect referrers
  let referrers: RequestCollection = {};

  // Collect versions
  let versions: RequestCollection = {};

  // Collect doc referrers
  let docsReferrers: RequestCollection = {};

  const sitemap = new Sitemapper({
    url: 'https://avatars.dicebear.com/sitemap.xml',
    timeout: 15000, // 15 seconds
  });

  const { sites: docsSites } = await sitemap.fetch();

  const linesSpinner = ora({
    prefixText: 'Read log lines. This may take a while.',
  }).start();

  const updateLinesSpinner = throttle(1000, (no: number) => {
    linesSpinner.text = `${no.toLocaleString('en-US')} lines processed`;
  });

  await log.processLineByLine(logFilePath, (line, i) => {
    updateLinesSpinner(i);

    let cols = line.split('|');
    let referrer = '-';
    let isHit = cols[0] === 'HIT';
    let statusCode = parseInt(cols[1]);
    let isError = statusCode >= 400;
    let apiMatch = cols[7].match(/(\d+\.\d+)\/(?:v2|api)/);
    let isDocs = docsSites.includes(cols[7]);

    if (null === apiMatch && false === isDocs) {
      return;
    }

    let version = '';
    let isApi = apiMatch !== null;

    if (apiMatch) {
      version = apiMatch[1];
    }

    referrer = cols[6].replace(/[^:]+:\/\/([^\/]+).*/, '$1');
    referrer = ['', '(null)'].includes(referrer) ? '-' : referrer;

    if (isApi) {
      referrers[referrer] = referrers[referrer] || {
        error: 0,
        hit: 0,
        miss: 0,
      };

      versions[version] = versions[version] || {
        error: 0,
        hit: 0,
        miss: 0,
      };
    }

    if (isDocs) {
      docsReferrers[referrer] = docsReferrers[referrer] || {
        error: 0,
        hit: 0,
        miss: 0,
      };
    }

    if (isError) {
      if (isApi) {
        referrers[referrer].error++;
        versions[version].error++;
      }

      if (isDocs) {
        docsReferrers[referrer].error++;
      }
    }

    if (isHit) {
      if (isApi) {
        referrers[referrer].hit++;
        versions[version].hit++;
      }

      if (isDocs) {
        docsReferrers[referrer].hit++;
      }
    } else {
      if (isApi) {
        referrers[referrer].miss++;
        versions[version].miss++;
      }

      if (isDocs) {
        docsReferrers[referrer].miss++;
      }
    }
  });

  linesSpinner.stop();

  const createTableData = (obj: RequestCollection) => {
    let result = [];

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        const { error, hit, miss } = obj[key];
        const requests = hit + miss;

        result.push([
          key,
          requests.toLocaleString('en-US'),
          error.toLocaleString('en-US'),
          `${(error ? (error / requests) * 100 : 0).toFixed(2)}%`,
          hit.toLocaleString('en-US'),
          `${(hit ? (hit / requests) * 100 : 0).toFixed(2)}%`,
          miss.toLocaleString('en-US'),
          `${(miss ? (miss / requests) * 100 : 0).toFixed(2)}%`,
          `$ ${((5 / 10000000) * miss * 30).toFixed(2)}`,
        ]);
      }
    }

    return result;
  };

  // Compile stats html
  const compileLoader = ora('Compiling stats').start();

  let template = await fs.readFile(path.join(__dirname, '../../views/cdn/stats.mustache'), { encoding: 'utf-8' });

  await fs.writeFile(
    statsFilePath,
    mustache.render(template, {
      referrerTableData: JSON.stringify(createTableData(referrers)),
      versionsTableData: JSON.stringify(createTableData(versions)),
      docsReferrerTableData: JSON.stringify(createTableData(docsReferrers)),
    })
  );

  open(statsFilePath);

  compileLoader.stop();
})();
