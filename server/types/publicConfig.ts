import * as yup from 'yup';

export type PublicConfigSpriteCollection = {
  id: string;
  name: string;
  options?: yup.Schema<any>;
};

export type PublicConfig = {
  spriteCollections: {
    [version: string]: Array<PublicConfigSpriteCollection>;
  };
};
