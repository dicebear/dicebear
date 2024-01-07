/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const sides: ComponentGroup = {
  antenna01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="sidesAntenna01-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="6" y="11" width="156" height="51"><g fill="#fff"><rect x="6" y="31" width="36" height="14" rx="4"/><rect x="18" y="14" width="36" height="48" rx="4"/><rect x="126" y="28" width="36" height="24" rx="4"/><path d="M11 11h2v20h-2z"/></g></mask><g mask="url(#sidesAntenna01-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path fill="#fff" fill-opacity=".3" d="M0 0h180v76H0z"/><path fill="#000" fill-opacity=".1" d="M0 38h180v38H0z"/></g><path fill="#fff" fill-opacity=".4" d="M11 11h2v20h-2z"/><circle cx="12" cy="8" r="4" fill="#FFEA8F"/><circle cx="13" cy="7" r="2" fill="#fff"/>`,
  antenna02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="sidesAntenna02-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="9" width="160" height="51"><g fill="#fff"><rect x="10" y="28" width="36" height="32" rx="4"/><path d="M160 9h2v20h-2z"/><rect x="134" y="28" width="36" height="32" rx="4"/></g></mask><g mask="url(#sidesAntenna02-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#000" fill-opacity=".1" d="M0 38h180v38H0z"/></g><path fill="#fff" fill-opacity=".4" d="M160 8h2v20h-2z"/><circle cx="161" cy="5" r="4" fill="#E1E6E8"/><circle cx="162" cy="4" r="2" fill="#fff"/>`,
  cables01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M38 12c-2.95 11.7-19.9 6.67-23.37 18-3.46 11.35 8.03 20 17.53 20" stroke="#2A3544" stroke-width="6" opacity=".9"/><path d="M150 55c8.4 3.49 20.1-7.6 16-16.5-4.1-8.9-16-6.7-16-19.3" stroke="#2A3544" stroke-width="4" opacity=".9"/><mask id="sidesCables01-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="21" y="6" width="138" height="58"><g fill="#fff"><rect x="21" y="35" width="16" height="22" rx="2"/><rect x="136" y="42" width="23" height="22" rx="2"/><rect x="136" y="6" width="23" height="18" rx="2"/></g></mask><g mask="url(#sidesCables01-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/></g>`,
  cables02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g opacity=".9" stroke="#2A3544"><ellipse cx="32.5" cy="23" rx="16.5" ry="18" stroke-width="6"/><path d="M29.51 36.76c-7.4 4.29-17 1.55-21.42-6.1" stroke-width="4"/><ellipse cx="28.5" cy="52.5" rx="16.5" ry="14.5" stroke-width="4"/></g><g opacity=".9" stroke="#2A3544"><path d="M168.6 60.42c-4.27-7.41-13.95-9.84-21.6-5.42" stroke-width="4"/><ellipse cx="148.5" cy="22.5" rx="16.5" ry="15.5" stroke-width="6"/></g><mask id="sidesCables02-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="21" y="0" width="138" height="72"><g fill="#fff"><rect x="21" y="27" width="16" height="22" rx="2"/><rect x="22" y="60" width="16" height="12" rx="2"/><rect x="143" y="42" width="16" height="22" rx="2"/><rect x="143" width="16" height="22" rx="2"/></g></mask><g mask="url(#sidesCables02-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/></g>`,
  round: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="sidesRound-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="12" y="16" width="156" height="45"><g fill="#fff"><ellipse cx="150" cy="38.5" rx="18" ry="22.5"/><ellipse cx="18" cy="22.5" rx="18" ry="22.5" transform="matrix(-1 0 0 1 48 16)"/></g></mask><g mask="url(#sidesRound-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#000" fill-opacity=".2" d="M20 0h140v76H20z"/></g>`,
  square: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="sidesSquare-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="14" y="16" width="152" height="44"><g fill="#fff"><rect x="14" y="16" width="36" height="44" rx="9"/><rect x="130" y="16" width="36" height="44" rx="9"/></g></mask><g mask="url(#sidesSquare-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#000" fill-opacity=".1" d="M0 38h180v38H0z"/></g>`,
  squareAssymetric: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="sidesSquareAssymetric-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="8" width="165" height="60"><g fill="#fff"><rect x="10" y="31" width="36" height="30" rx="4"/><rect x="20" y="15" width="26" height="30" rx="4"/><rect x="139" y="23" width="36" height="30" rx="4"/><rect x="134" y="8" width="36" height="60" rx="4"/></g></mask><g mask="url(#sidesSquareAssymetric-a)"><path d="M0 0h180v76H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#000" fill-opacity=".1" d="M0 47h180v29H0z"/><circle cx="161" cy="20" r="5" fill="#fff" fill-opacity=".6"/><circle cx="161" cy="36" r="5" fill="#fff" fill-opacity=".6"/></g>`,
};
