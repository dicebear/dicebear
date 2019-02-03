export type PrivateConfig = {
  port: number;
  privacyPolicyFile?: string;
  legalNoticeFile?: string;
  metaCaching: string;
  httpCaching: string;
  memoryCaching: string;
  apiHttpCaching: string;
  apiMemoryCaching: string;
  githubAccessToken: string;
  mongodbUri?: string;
  mongodbDatabase: string;
  mongodbReconnectInterval: number;
  mongodbReconnectTries: number;
};
