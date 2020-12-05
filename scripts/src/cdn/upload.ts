import * as api from '../utils/cdn-api';
import * as directory from '../utils/directory';
import * as ftp from 'basic-ftp';
import path from 'path';
import ora from 'ora';
import spawn from 'cross-spawn';

(async () => {
  const websiteBuildDir = path.resolve(__dirname, '../../../website/build');

  // Build docs
  spawn.sync(
    'yarn',
    ['--cwd', path.resolve(__dirname, '../../..'), 'workspace', '@dicebear/avatars-website', 'run', 'build'],
    { stdio: 'inherit' }
  );

  // Upload build
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

  await client.uploadFromDir(websiteBuildDir);
  await client.close();

  uploadSpinner.stop();

  // Clear CDN cache
  const cacheSpinner = ora({
    prefixText: 'Clear CDN Cache',
  }).start();

  const directories = ['', ...(await directory.getDirectories(websiteBuildDir, true))];

  for (let i = 0; i < directories.length; i++) {
    let directory = directories[i];
    let url = `https://${process.env.BUNNYCDN_HOSTNAME}/${directory}`;

    cacheSpinner.text = url;

    await api.post(`purge?url=${encodeURIComponent(url)}`);
    await api.post(`purge?url=${encodeURIComponent(`${url}/index.html`)}`);
  }

  cacheSpinner.stop();
})();
