import * as express from 'express';
import * as next from 'next';
import * as apicache from 'apicache';

import privateConfig from '../config/private';

import v2 from './actions/v2';
import v3 from './actions/v3';
import meta from './actions/meta';

const ms = require('ms');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const cache = apicache.middleware;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(v2);
    server.use(v3);
    server.use(meta);

    server.get('*', cache(ms(privateConfig.memoryCaching)), (req, res) => {
      res.setHeader('Cache-Control', 'public, max-age=' + ms(privateConfig.httpCaching) / 1000);

      handle(req, res);
    });

    server.listen(privateConfig.port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${privateConfig.port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
