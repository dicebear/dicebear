import { SchemaDescription } from 'yup';

export type MetaSpriteCollection = {
  id: string;
  name: string;
  version: string;
  options: SchemaDescription;
};

export type Meta = {
  license: {
    name: string;
    url: string;
  };
  stargazers: {
    url: string;
    count: number;
  };
  forks: {
    url: string;
    count: number;
  };
  issues: {
    url: string;
    count: number;
  };
  name: string;
  version: string;
  spriteCollections: MetaSpriteCollection[];
  privacy_policy?: string;
  legal_notice?: string;
};
