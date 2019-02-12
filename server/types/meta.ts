import { SchemaDescription } from 'yup';

export type MetaSpriteCollection = {
  id: string;
  name: string;
  options: SchemaDescription;
};

export type Stats = {
  line: {
    [date: string]: number;
  };
  total: {
    sum: number;
    since: string;
  };
};

export type Meta = {
  stargazers: {
    url: string;
    count: number;
  };
  issues: {
    url: string;
    count: number;
  };
  name: string;
  stats?: Stats;
  spriteCollections: MetaSpriteCollection[];
  privacy_policy?: string;
  legal_notice?: string;
};
