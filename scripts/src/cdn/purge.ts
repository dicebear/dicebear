import * as api from '../utils/cdn-api';

(async () => {
  await api.post(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}/purgeCache`);
})();
