import type { SpriteCollection as SpriteCollectionStyle } from "@dicebear/avatars";

type SpriteCollection<U = string | number> = {
  id: string;
  style: SpriteCollectionStyle;
  options: Record<
    string,
    {
      type: "select" | "checkbox" | "range" | "switch" | "number" | "color";
      values?: U[];
      defaultValue: U;
      alias?: string;
    }
  >;
};

export default SpriteCollection;
