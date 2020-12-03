import avataaarsOptions from "./avataaars";
import botttsOptions from "./bottts";
import femaleOptions from "./female";
import humanOptions from "./human";
import gridyOptions from "./gridy";
import identiconOptions from "./identicon";
import initialsOptions from "./initials";
import jdenticonOptions from "./jdenticon";
import maleOptions from "./male";

import avataaars from "@dicebear/avatars-avataaars-sprites";
import bottts from "@dicebear/avatars-bottts-sprites";
import female from "@dicebear/avatars-female-sprites";
import human from "@dicebear/avatars-human-sprites";
import gridy from "@dicebear/avatars-gridy-sprites";
import identicon from "@dicebear/avatars-identicon-sprites";
import initials from "@dicebear/avatars-initials-sprites";
import jdenticon from "@dicebear/avatars-jdenticon-sprites";
import male from "@dicebear/avatars-male-sprites";
import SpriteCollection from "../types/spriteCollection";

export default [
  {
    id: "male",
    style: male,
    options: maleOptions,
  },
  {
    id: "female",
    style: female,
    options: femaleOptions,
  },
  {
    id: "human",
    style: human,
    options: humanOptions,
  },
  {
    id: "identicon",
    style: identicon,
    options: identiconOptions,
  },
  {
    id: "initials",
    style: initials,
    options: initialsOptions,
  },
  {
    id: "bottts",
    style: bottts,
    options: botttsOptions,
  },
  {
    id: "avataaars",
    style: avataaars,
    options: avataaarsOptions,
  },
  {
    id: "jdenticon",
    style: jdenticon,
    options: jdenticonOptions,
  },
  {
    id: "gridy",
    style: gridy,
    options: gridyOptions,
  },
] as SpriteCollection[];
