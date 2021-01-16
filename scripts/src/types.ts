export interface Options {
  cdn: {
    blocked: {
      referrer: string[];
    };
    redirect: {
      [to: string]: string[];
    };
    header: {
      remove: string[];
    };
    cache: {
      client: {
        [duration: string]: string[];
      };
      server: {
        [duration: string]: string[];
      };
    };
    origin: {
      [host: string]: string[];
    };
    cors: string[];
  };
}

export enum TriggerType {
  RequestURL = 0,
  RequestHeader = 1,
  ResponseHeader = 2,
  FileExtension = 3,
  CountryCode = 4,
  RemoteIP = 5,
  QueryString = 6,
  RandomChance = 7,
}

export enum MatchingType {
  Any = 0,
  All = 0,
  None = 0,
}

export interface Trigger {
  Type: TriggerType;
  Parameter1: string;
  PatternMatches: string[];
  PatternMatchingType: MatchingType;
}

export enum ActionType {
  ForceSSL = 0,
  Redirect = 1,
  OriginUrl = 2,
  OverrideCacheTime = 3,
  BlockRequest = 4,
  SetResponseHeader = 5,
  SetRequestHeader = 6,
  ForceDownload = 7,
  DisableTokenAuthentication = 8,
  EnableTokenAuthentication = 9,
}

export interface EdgeRule {
  Guid?: string;
  ActionType: ActionType;
  ActionParameter1: string;
  ActionParameter2: string;
  Triggers: Trigger[];
  TriggerMatchingType: MatchingType;
  Description: string;
  Enabled: boolean;
}

export interface Pullzone {
  BlockedReferrers: string[];
  EdgeRules: EdgeRule[];
}
