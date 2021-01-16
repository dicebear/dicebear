import crypto from 'crypto';
import * as time from './time';
import * as array from './array';
import { ActionType, EdgeRule, MatchingType, TriggerType } from '../types';

export function isManaged(edgeRule: EdgeRule) {
  return edgeRule.Description.startsWith(getManagedId(edgeRule));
}

export function makeManaged(edgeRule: EdgeRule) {
  if (false === isManaged(edgeRule)) {
    let id = getManagedId(edgeRule);

    edgeRule.Description = edgeRule.Description.length > 0 ? `${id} ${edgeRule.Description}` : id;
  }

  return edgeRule;
}

export function getManagedId(edgeRule: EdgeRule) {
  let data = [
    edgeRule.Enabled,
    edgeRule.ActionType,
    edgeRule.ActionParameter1,
    edgeRule.ActionParameter2,
    edgeRule.TriggerMatchingType,
    edgeRule.Triggers.map((trigger) => [
      trigger.Type,
      trigger.Parameter1,
      trigger.PatternMatches,
      trigger.PatternMatchingType,
    ]),
  ];

  var shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(data));

  return `(MANAGED: ${shasum.digest('hex')})`;
}

export function createBlockReferrers(referrers: string[]) {
  referrers = referrers.reduce<string[]>((result, val) => {
    return [...result, val, `*.${val}`];
  }, []);

  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: 'Block Referrers',
    ActionType: ActionType.BlockRequest,
    ActionParameter1: '',
    ActionParameter2: '',
    TriggerMatchingType: MatchingType.Any,
    Triggers: array.chunk(referrers, 5).map((val) => {
      return {
        Type: TriggerType.RequestHeader,
        Parameter1: 'Referer',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: val,
      };
    }),
  };

  return makeManaged(edgeRule);
}

export function createRedirect(to: string, from: string[]) {
  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: `Redirect to ${to}`,
    ActionType: ActionType.Redirect,
    ActionParameter1: to,
    ActionParameter2: '',
    TriggerMatchingType: MatchingType.Any,
    Triggers: array.chunk(from, 5).map((val) => {
      return {
        Type: TriggerType.RequestURL,
        Parameter1: '',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: val,
      };
    }),
  };

  return makeManaged(edgeRule);
}

export function createRemoveHeader(name: string) {
  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: `Remove ${name} header`,
    ActionType: ActionType.SetResponseHeader,
    ActionParameter1: name,
    ActionParameter2: '',
    TriggerMatchingType: MatchingType.Any,
    Triggers: [
      {
        Type: TriggerType.RequestURL,
        Parameter1: '',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: ['*'],
      },
    ],
  };

  return makeManaged(edgeRule);
}

export function createCorsHeader(routes: string[]) {
  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: `Set cors`,
    ActionType: ActionType.SetResponseHeader,
    ActionParameter1: 'access-control-allow-origin',
    ActionParameter2: `*`,
    TriggerMatchingType: MatchingType.Any,
    Triggers: array.chunk(routes, 5).map((val) => {
      return {
        Type: TriggerType.RequestURL,
        Parameter1: '',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: val,
      };
    }),
  };

  return makeManaged(edgeRule);
}

export function createClientCache(timeString: string, routes: string[]) {
  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: `Set ${timeString} client cache`,
    ActionType: ActionType.SetResponseHeader,
    ActionParameter1: 'cache-control',
    ActionParameter2: `max-age=${time.toSeconds(timeString)}`,
    TriggerMatchingType: MatchingType.Any,
    Triggers: array.chunk(routes, 5).map((val) => {
      return {
        Type: TriggerType.RequestURL,
        Parameter1: '',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: val,
      };
    }),
  };

  return makeManaged(edgeRule);
}

export function createServerCache(timeString: string, routes: string[]) {
  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: `Set ${timeString} server cache`,
    ActionType: ActionType.OverrideCacheTime,
    ActionParameter1: time.toSeconds(timeString).toString(),
    ActionParameter2: '',
    TriggerMatchingType: MatchingType.Any,
    Triggers: array.chunk(routes, 5).map((val) => {
      return {
        Type: TriggerType.RequestURL,
        Parameter1: '',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: val,
      };
    }),
  };

  return makeManaged(edgeRule);
}

export function createOrigin(origin: string, routes: string[]) {
  let edgeRule: EdgeRule = {
    Enabled: true,
    Description: `Set origin to ${origin}`,
    ActionType: ActionType.OriginUrl,
    ActionParameter1: origin,
    ActionParameter2: '',
    TriggerMatchingType: MatchingType.Any,
    Triggers: array.chunk(routes, 5).map((val) => {
      return {
        Type: TriggerType.RequestURL,
        Parameter1: '',
        PatternMatchingType: MatchingType.Any,
        PatternMatches: val,
      };
    }),
  };

  return makeManaged(edgeRule);
}
