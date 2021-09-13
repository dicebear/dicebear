import type { Prng } from '@dicebear/core';
import type { Options } from '../options';
import type { ComponentPickCollection } from '../static-types';
import { pickComponent } from './pickComponent';

type Props = {
  prng: Prng;
  options: Options;
};

export function getComponents({
  prng,
  options,
}: Props): ComponentPickCollection {
  const centerModifierComponent = pickComponent({
    prng,
    group: 'centerModifier',
    values: options.centerModifier,
  });
  const cornersModifierComponent = pickComponent({
    prng,
    group: 'cornersModifier',
    values: options.cornersModifier,
  });
  const sidesModifierComponent = pickComponent({
    prng,
    group: 'sidesModifier',
    values: options.sidesModifier,
  });
  const sidesWrapperComponent = pickComponent({
    prng,
    group: 'sidesWrapper',
    values: options.sidesWrapper,
  });
  const sidesComponent = pickComponent({
    prng,
    group: 'sides',
    values: options.sides,
  });
  const cornersWrapperComponent = pickComponent({
    prng,
    group: 'cornersWrapper',
    values: options.cornersWrapper,
  });
  const cornersComponent = pickComponent({
    prng,
    group: 'corners',
    values: options.corners,
  });
  const centerWrapperComponent = pickComponent({
    prng,
    group: 'centerWrapper',
    values: options.centerWrapper,
  });
  const centerComponent = pickComponent({
    prng,
    group: 'center',
    values: options.center,
  });

  return {
    centerModifier: centerModifierComponent,
    cornersModifier: cornersModifierComponent,
    sidesModifier: sidesModifierComponent,
    sidesWrapper: sidesWrapperComponent,
    sides: sidesComponent,
    cornersWrapper: cornersWrapperComponent,
    corners: cornersComponent,
    centerWrapper: centerWrapperComponent,
    center: centerComponent,
  };
}
