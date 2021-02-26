import * as api from '../utils/cdn-api';
import * as edgeRule from '../utils/edge-rule';
import * as options from '../utils/options';
import { EdgeRule, Pullzone } from '../types';

(async () => {
  const { cdn: cdnOptions } = await options.read();
  const { body: pullzone } = await api.get<Pullzone>(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}`);

  // Collect managed edge rules
  let managedEdgeRules = pullzone.EdgeRules.reduce<Record<string, string>>((result, val) => {
    if (edgeRule.isManaged(val) && val.Guid) {
      return {
        ...result,
        [edgeRule.getManagedId(val)]: val.Guid,
      };
    }

    return result;
  }, {});

  // Save function
  const newEdgeRules: EdgeRule[] = [];
  const saveEdgeRule = (val: EdgeRule) => {
    let managedId = edgeRule.getManagedId(val);

    if (managedEdgeRules[managedId]) {
      delete managedEdgeRules[managedId];
    } else {
      newEdgeRules.push(val);
    }
  };

  // Update blocked referrers
  if (cdnOptions.blocked.referrer.length > 0) {
    saveEdgeRule(edgeRule.createBlockReferrers(cdnOptions.blocked.referrer));
  }

  // Update redirects
  let redirects = Object.keys(cdnOptions.redirect);

  for (let i = 0; i < redirects.length; i++) {
    let to = redirects[i];
    let from = cdnOptions.redirect[to];

    saveEdgeRule(edgeRule.createRedirect(to, from));
  }

  // Remove headers
  for (let i = 0; i < cdnOptions.header.remove.length; i++) {
    let name = cdnOptions.header.remove[i];

    saveEdgeRule(edgeRule.createRemoveHeader(name));
  }

  // Update client cache
  let cacheClientTimes = Object.keys(cdnOptions.cache.client);

  for (let i = 0; i < cacheClientTimes.length; i++) {
    let timeString = cacheClientTimes[i];
    let routes = cdnOptions.cache.client[timeString];

    saveEdgeRule(edgeRule.createClientCache(timeString, routes));
  }

  // Update server cache
  let cacheServerTimes = Object.keys(cdnOptions.cache.server);

  for (let i = 0; i < cacheServerTimes.length; i++) {
    let timeString = cacheServerTimes[i];
    let routes = cdnOptions.cache.server[timeString];

    saveEdgeRule(edgeRule.createServerCache(timeString, routes));
  }

  // Update origin
  let origins = Object.keys(cdnOptions.origin);

  for (let i = 0; i < origins.length; i++) {
    let origin = origins[i];
    let routes = cdnOptions.origin[origin];

    saveEdgeRule(edgeRule.createOrigin(origin, routes));
  }

  // Update cors headers
  if (cdnOptions.cors) {
    saveEdgeRule(edgeRule.createCorsHeader(cdnOptions.cors));
  }

  // Delete obsolete managed edge rules
  let managedEdgeRulesValues = Object.values(managedEdgeRules);

  for (let i = 0; i < managedEdgeRulesValues.length; i++) {
    let id = managedEdgeRulesValues[i];

    await api.del(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}/edgerules/${id}`);
  }

  // Save new rules
  if (newEdgeRules.length > 0) {
    await Promise.all(
      newEdgeRules.map(async (edgeRule) => {
        try {
          await api.post(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}/edgerules/addOrUpdate`, edgeRule);
        } catch (e) {
          console.error(e);
        }
      })
    );
  }
})();
