import { PrivateConfig } from '../types/privateConfig';

let privateConfig: PrivateConfig = {
  port: parseInt(process.env.PORT, 10) || 3000,
  privacyPolicyFile: process.env.PRIVACY_POLICY_FILE,
  legalNoticeFile: process.env.LEGAL_NOTICE_FILE,
  metaCaching: '1h',
  httpCaching: '1h',
  memoryCaching: '1h',
  apiHttpCaching: '30d',
  apiMemoryCaching: '1d',
  githubAccessToken: process.env.GITHUB_ACCESS_TOKEN,
  mongodbUri: process.env.MONGODB_URI,
  mongodbDatabase: process.env.MONGODB_DATABASE || 'avatars',
  mongodbReconnectInterval: parseInt(process.env.MONGODB_RECONNECT_INTERVAL) || 1000,
  mongodbReconnectTries: parseInt(process.env.MONGODB_RECONNECT_TRIES) || Number.MAX_VALUE
};

export default privateConfig;
