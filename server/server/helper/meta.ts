import * as request from 'request-promise-native';
import * as latestVersion from 'latest-version';
import * as fs from 'fs-extra';
import * as yup from 'yup';

import privateConfig from '../../config/private';
import publicConfig from '../../config/public';

import { MetaSpriteCollection } from '../../types/meta';

export async function getMetaData() {
  let headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Dicebear-Avatars'
  };

  if (privateConfig.githubAccessToken) {
    headers['Authorization'] = 'token ' + privateConfig.githubAccessToken;
  }

  let repositoryRequest = request
    .get('https://api.github.com/repos/dicebear/avatars', {
      headers: headers
    })
    .then(response => JSON.parse(response));

  let [repository, version, spriteVersions] = await Promise.all([
    repositoryRequest,
    latestVersion('@dicebear/avatars'),
    Promise.all(publicConfig.spriteCollections.v3.map(spriteCollection => latestVersion(spriteCollection.name)))
  ]);

  let spriteCollections: MetaSpriteCollection[] = [];

  publicConfig.spriteCollections.v3.forEach((spriteCollection, key) => {
    spriteCollections.push({
      id: spriteCollection.id,
      name: spriteCollection.name,
      version: spriteVersions[key],
      options: spriteCollection.options ? spriteCollection.options.describe() : yup.object().describe()
    });
  });

  return {
    license: {
      name: repository.license.name,
      url: repository.html_url + '/blob/master/LICENSE'
    },
    stargazers: {
      url: repository.html_url + '/stargazers',
      count: repository.stargazers_count
    },
    forks: {
      url: repository.html_url + '/network',
      count: repository.forks_count
    },
    issues: {
      url: repository.html_url + '/issues',
      count: repository.issues_count
    },
    name: '@dicebear/avatars',
    version: version,
    spriteCollections: spriteCollections,
    privacy_policy: privateConfig.privacyPolicyFile
      ? await fs.readFile(privateConfig.privacyPolicyFile, 'utf8')
      : undefined,
    legal_notice: privateConfig.legalNoticeFile ? await fs.readFile(privateConfig.legalNoticeFile, 'utf8') : undefined
  };
}
