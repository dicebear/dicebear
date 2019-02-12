import * as request from 'request-promise-native';
import * as fs from 'fs-extra';
import * as yup from 'yup';
import * as memoizee from 'memoizee';
const isUrl = require('is-url');
const ms = require('ms');

import privateConfig from '../../config/private';
import publicConfig from '../../config/public';

import * as mongodb from './mongodb';

import { MetaSpriteCollection, Stats } from '../../types/meta';

export const getMetaData = memoizee(
  async function() {
    let headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Dicebear-Avatars'
    };

    if (privateConfig.githubAccessToken) {
      headers['Authorization'] = 'token ' + privateConfig.githubAccessToken;
    }

    let repository = await request
      .get('https://api.github.com/repos/dicebear/avatars', {
        headers: headers
      })
      .then(response => JSON.parse(response));

    let spriteCollections: MetaSpriteCollection[] = [];

    publicConfig.spriteCollections.v3.forEach((spriteCollection, key) => {
      spriteCollections.push({
        id: spriteCollection.id,
        name: spriteCollection.name,
        options: spriteCollection.options ? spriteCollection.options.describe() : yup.object().describe()
      });
    });

    let privacyPolicy: string;

    if (privateConfig.privacyPolicyFile) {
      if (isUrl(privateConfig.privacyPolicyFile)) {
        let privacyPolicyHeaders = {
          'User-Agent': 'Dicebear-Avatars'
        };

        if (privateConfig.privacyPolicyFile.startsWith('https://api.github.com/')) {
          privacyPolicyHeaders['Accept'] = 'application/vnd.github.v3.raw';

          if (privateConfig.githubAccessToken) {
            privacyPolicyHeaders['Authorization'] = 'token ' + privateConfig.githubAccessToken;
          }
        }

        privacyPolicy = await request(privateConfig.privacyPolicyFile, {
          headers: privacyPolicyHeaders
        });
      } else {
        privacyPolicy = await fs.readFile(privateConfig.privacyPolicyFile, 'utf8');
      }
    }

    let legalNotice: string;

    if (privateConfig.legalNoticeFile) {
      if (isUrl(privateConfig.legalNoticeFile)) {
        let legalNoticeHeaders = {
          'User-Agent': 'Dicebear-Avatars'
        };

        if (privateConfig.privacyPolicyFile.startsWith('https://api.github.com/')) {
          legalNoticeHeaders['Accept'] = 'application/vnd.github.v3.raw';

          if (privateConfig.githubAccessToken) {
            legalNoticeHeaders['Authorization'] = 'token ' + privateConfig.githubAccessToken;
          }
        }

        legalNotice = await request(privateConfig.legalNoticeFile, {
          headers: legalNoticeHeaders
        });
      } else {
        legalNotice = await fs.readFile(privateConfig.legalNoticeFile, 'utf8');
      }
    }

    let stats: Stats;

    if (privateConfig.mongodbUri) {
      stats = {
        line: await mongodb.line(),
        total: await mongodb.total()
      };
    }

    return {
      stargazers: {
        url: repository.html_url + '/stargazers',
        count: repository.stargazers_count
      },
      issues: {
        url: repository.html_url + '/issues',
        count: repository.issues_count
      },
      stats: stats,
      name: '@dicebear/avatars',
      spriteCollections: spriteCollections,
      privacy_policy: privacyPolicy,
      legal_notice: legalNotice
    };
  },
  {
    maxAge: ms(privateConfig.metaCaching),
    promise: true
  }
);
