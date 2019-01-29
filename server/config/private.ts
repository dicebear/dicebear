import { PrivateConfig } from '../types/privateConfig';

let privateConfig: PrivateConfig = {
  port: parseInt(process.env.PORT, 10) || 3000,
  privacyPolicyFile: process.env.PRIVACY_POLICY_FILE,
  legalNoticeFile: process.env.LEGAL_NOTICE_FILE,
  metaCacheLifetime: 3600,
  httpCaching: '1h',
  memoryCaching: '1h',
  apiHttpCaching: '30d',
  apiMemoryCaching: '1d',
  githubAccessToken: process.env.GITHUB_ACCESS_TOKEN
};

export default privateConfig;
