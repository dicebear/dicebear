import * as ftp from 'basic-ftp';

(async () => {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  await client.access({
    host: 'storage.bunnycdn.com',
    user: process.env.BUNNYCDN_STORAGE_ZONE_NAME,
    password: process.env.BUNNYCDN_FTP_PASSWORD,
  });

  await client.clearWorkingDir();
  await client.close();
})();
