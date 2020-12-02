import * as api from '../utils/api';
import * as edgeRule from '../utils/edge-rule';
import { EdgeRule, Options, Pullzone } from '../types';

export function update(options: Options) {
  return async () => {
    let { body: pullzone } = await api.get<Pullzone>(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}`);

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
    const saveEdgeRule = async (val: EdgeRule) => {
      let managedId = edgeRule.getManagedId(val);

      if (managedEdgeRules[managedId]) {
        delete managedEdgeRules[managedId];
      } else {
        try {
          await api.post(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}/edgerules/addOrUpdate`, val);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // Update blocked referrers
    if (options.blocked.referrer) {
      await saveEdgeRule(edgeRule.createBlockReferrers(options.blocked.referrer));
    }

    // Update redirects
    let redirects = Object.keys(options.redirect);

    for (let i = 0; i < redirects.length; i++) {
      let to = redirects[i];
      let from = options.redirect[to];

      await saveEdgeRule(edgeRule.createRedirect(to, from));
    }

    // Remove headers
    for (let i = 0; i < options.header.remove.length; i++) {
      let name = options.header.remove[i];

      await saveEdgeRule(edgeRule.createRemoveHeader(name));
    }

    // Update client cache
    let cacheClientTimes = Object.keys(options.cache.client);

    for (let i = 0; i < cacheClientTimes.length; i++) {
      let timeString = cacheClientTimes[i];
      let routes = options.cache.client[timeString];

      await saveEdgeRule(edgeRule.createClientCache(timeString, routes));
    }

    // Update server cache
    let cacheServerTimes = Object.keys(options.cache.server);

    for (let i = 0; i < cacheServerTimes.length; i++) {
      let timeString = cacheServerTimes[i];
      let routes = options.cache.server[timeString];

      await saveEdgeRule(edgeRule.createServerCache(timeString, routes));
    }

    // Update origin
    let origins = Object.keys(options.origin);

    for (let i = 0; i < origins.length; i++) {
      let origin = origins[i];
      let routes = options.origin[origin];

      await saveEdgeRule(edgeRule.createOrigin(origin, routes));
    }

    // Delete obsolete managed edge rules
    let managedEdgeRulesValues = Object.values(managedEdgeRules);

    for (let i = 0; i < managedEdgeRulesValues.length; i++) {
      let id = managedEdgeRulesValues[i];

      await api.del(`pullzone/${process.env.BUNNYCDN_PULL_ZONE_ID}/edgerules/${id}`);
    }
  };
}
