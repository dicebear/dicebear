import Avatars from '@dicebear/avatars-v2';
import * as apicache from 'apicache';

import * as express from 'express';
import privateConfig from '../../config/private';
import publicConfig from '../../config/public';
import { PublicConfigSpriteCollection } from '../../types/publicConfig';

const ms = require('ms');

const cache = apicache.middleware;
const router = express.Router();

const spriteCollections = new Map<string, PublicConfigSpriteCollection>();

publicConfig.spriteCollections.v2.forEach(spriteCollection => {
  spriteCollections.set(spriteCollection.id, spriteCollection);
});

router.get(/^\/v2\/([^/]+)\/([^/]*)\.svg$/, cache(ms(privateConfig.apiMemoryCaching)), async function(req, res, next) {
  let spriteCollection = spriteCollections.get(req.params[0]);

  if (undefined === spriteCollection) {
    res.status(400);
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid sprite collection. Available: ' + [...spriteCollections.keys()].join(', '));

    return;
  }

  let seed = req.params[1];

  try {
    let spriteCollectionPackage = await import(spriteCollection.name);

    if (spriteCollectionPackage.default) {
      spriteCollectionPackage = spriteCollectionPackage.default;
    }

    res.status(200);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=' + ms(privateConfig.apiHttpCaching) / 1000);
    res.end(new Avatars(spriteCollectionPackage).create(seed));
  } catch (e) {
    console.log(e);

    res.status(500);
    res.setHeader('Content-Type', 'text/plain');
    res.end('Failed to load package ' + spriteCollection.name);
  }
});

export default router;
