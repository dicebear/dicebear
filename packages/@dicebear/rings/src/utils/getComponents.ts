/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getComponents({
  prng,
  options,
}: Props): ComponentPickCollection {
  const ringComponent = pickComponent({
    prng,
    group: 'ring',
    values: options.ring,
    width: 100,
    height: 100,
    rotation: options.ringRotation?.length ? options.ringRotation : [0],
    offsetX: [0],
    offsetY: [0],
  });
  const ringOneComponent = pickComponent({
    prng,
    group: 'ringOne',
    values: options.ringOne,
    width: 100,
    height: 100,
    rotation: options.ringOneRotation?.length ? options.ringOneRotation : [0],
    offsetX: [0],
    offsetY: [0],
  });
  const ringTwoComponent = pickComponent({
    prng,
    group: 'ringTwo',
    values: options.ringTwo,
    width: 100,
    height: 100,
    rotation: options.ringTwoRotation?.length ? options.ringTwoRotation : [0],
    offsetX: [0],
    offsetY: [0],
  });
  const ringThreeComponent = pickComponent({
    prng,
    group: 'ringThree',
    values: options.ringThree,
    width: 100,
    height: 100,
    rotation: options.ringThreeRotation?.length
      ? options.ringThreeRotation
      : [0],
    offsetX: [0],
    offsetY: [0],
  });
  const ringFourComponent = pickComponent({
    prng,
    group: 'ringFour',
    values: options.ringFour,
    width: 100,
    height: 100,
    rotation: options.ringFourRotation?.length ? options.ringFourRotation : [0],
    offsetX: [0],
    offsetY: [0],
  });
  const ringFiveComponent = pickComponent({
    prng,
    group: 'ringFive',
    values: options.ringFive,
    width: 100,
    height: 100,
    rotation: options.ringFiveRotation?.length ? options.ringFiveRotation : [0],
    offsetX: [0],
    offsetY: [0],
  });

  return {
    ring: ringComponent,
    ringOne: ringOneComponent,
    ringTwo: ringTwoComponent,
    ringThree: ringThreeComponent,
    ringFour: ringFourComponent,
    ringFive: ringFiveComponent,
  };
}
