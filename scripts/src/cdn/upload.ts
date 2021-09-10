import * as api from '../utils/cdn-api';
import * as directory from '../utils/directory';
import * as ftp from 'basic-ftp';
import path from 'path';
import ora from 'ora';
import spawn from 'cross-spawn';

(async () => {
  const websiteBuildDir = path.resolve(__dirname, '../../../website/build');

  // Build docs
  spawn.sync('npm', ['run', 'build', '--workspace', '@dicebear/website'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../..'),
  });

  // Connect client
  const client = new ftp.Client();
  const uploadSpinner = ora({
    prefixText: 'Upload files',
  }).start();

  client.trackProgress((info) => {
    uploadSpinner.text = info.name;
  });

  await client.access({
    host: 'storage.bunnycdn.com',
    user: process.env.BUNNYCDN_STORAGE_ZONE_NAME,
    password: process.env.BUNNYCDN_FTP_PASSWORD,
  });

  // Upload build
  await client.uploadFromDir(websiteBuildDir);
  await client.close();

  uploadSpinner.stop();

  // Clear CDN cache
  const cacheSpinner = ora({
    prefixText: 'Clear CDN Cache',
  }).start();

  const items = [
    '',
    ...(await directory.list(websiteBuildDir, { directories: true })),
  ];

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let url = `https://${process.env.BUNNYCDN_HOSTNAME}/${item}`;

    cacheSpinner.text = url;

    await api.post(`purge?url=${encodeURIComponent(url)}`);
    await api.post(`purge?url=${encodeURIComponent(`${url}/index.html`)}`);
  }

  cacheSpinner.stop();
})();
