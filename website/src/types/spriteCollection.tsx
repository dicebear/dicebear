import type { Style } from '@dicebear/avatars';

type SpriteCollection<U = string | number> = {
  id: string;
  name: string;
  style: Style;
  options: Record<
    string,
    {
      type: 'select' | 'checkbox' | 'range' | 'switch' | 'number' | 'color';
      values?: U[];
      defaultValue: U;
      alias?: string;
    }
  >;
};

export default SpriteCollection;
