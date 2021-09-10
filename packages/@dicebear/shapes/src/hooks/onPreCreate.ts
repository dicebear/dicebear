import { Prng, StyleOptions } from "@dicebear/avatars";

import { Options } from "../options";

type Props = { prng: Prng, options: StyleOptions<Options> } 

export function onPreCreate({ prng, options }: Props) {
  const pickModifier = <T extends string>(modifier: T[] = [], alreadyPicked: T[] = []): T[] => {
    const pickItems = modifier.filter(v => false === alreadyPicked.includes(v) && v === 'none');
    const pick = prng.pick(pickItems.length ? pickItems : modifier);
  
    return pick ? [pick] : [];
  }
  
  options.centerModifier = pickModifier(options.centerModifier);
  options.sidesModifier = pickModifier(options.sidesModifier, [options.centerModifier[0]]);
  options.cornersModifier = pickModifier(options.cornersModifier, [options.centerModifier[0], options.sidesModifier[0]]);
}
