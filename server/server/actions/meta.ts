import * as express from 'express';
import * as apicache from 'apicache';

import { getMetaData } from '../helper/meta';
import privateConfig from '../../config/private';

const ms = require('ms');
const cache = apicache.middleware;
const router = express.Router();

router.get('/meta.json', cache(ms(privateConfig.memoryCaching)), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=' + ms(privateConfig.httpCaching) / 1000);
  res.send(await getMetaData());
});

export default router;
