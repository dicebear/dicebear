import { SchemaDescription } from 'yup';

export type MetaSpriteCollection = {
  id: string;
  name: string;
  options: SchemaDescription;
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
  spriteCollections: MetaSpriteCollection[];
  privacy_policy?: string;
  legal_notice?: string;
};
