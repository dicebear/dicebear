import Avatars from '@dicebear/avatars';
import * as apicache from 'apicache';
import * as yup from 'yup';

import * as request from 'request-promise-native';
import * as express from 'express';
import privateConfig from '../../config/private';
import publicConfig from '../../config/public';
import { PublicConfigSpriteCollection } from '../../types/publicConfig';
import { registerApiRequest } from '../helper/mongodb';

const ms = require('ms');

const cache = apicache.middleware;
const router = express.Router();

const spriteCollections = new Map<string, PublicConfigSpriteCollection>();

publicConfig.spriteCollections.v3.forEach(spriteCollection => {
  spriteCollections.set(spriteCollection.id, spriteCollection);
});

router.get(
  ['/v2/:spriteCollection/:seed.svg', '/v2/:spriteCollection/.svg'],
  function(req, res, next) {
    let spriteCollection = spriteCollections.get(req.params['spriteCollection']);

    if (undefined === spriteCollection) {
      res.status(400).end('Invalid sprite collection. Available: ' + [...spriteCollections.keys()].join(', '));

      return;
    }

    next();
  },
  async function(req, res, next) {
    next();

    registerApiRequest(req.params['spriteCollection']);
  },
  cache(ms(privateConfig.apiMemoryCaching)),
  async function(req, res, next) {
    let spriteCollection = spriteCollections.get(req.params['spriteCollection']);
    let options = spriteCollection.options || yup.object({}).noUnknown();
    let requestOptions = req.query.options || {};

    try {
      await options.validate(requestOptions);
    } catch (e) {
      res.status(400).end(e['errors'].join(''));

      return;
    }

    let seed = req.params['seed'] || '';

    try {
      let spriteCollectionPackage = await import(spriteCollection.name);

      if (spriteCollectionPackage.default) {
        spriteCollectionPackage = spriteCollectionPackage.default;
      }

      if ('gravatar' in req.query) {
        try {
          let gravatarSize = parseInt(req.query['s']);
          let gravatarUrl = gravatarSize
            ? `https://gravatar.com/avatar/${seed}.png?d=404&s=${gravatarSize}`
            : `https://gravatar.com/avatar/${seed}.png?d=404`;

          // Check whether the image exists at Gravatar.
          await request.head(gravatarUrl).promise();

          res.redirect(gravatarUrl);

          return;
        } catch (e) {
          // No image available at Gravtar, therefore no forwarding.
        }
      }

      res.status(200);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=' + ms(privateConfig.apiHttpCaching) / 1000);
      res.end(new Avatars(spriteCollectionPackage(options.cast(requestOptions))).create(seed));
    } catch (e) {
      console.error(e);

      res.status(500).end('Failed to load package ' + spriteCollection.name);
    }
  }
);

export default router;
