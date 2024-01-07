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

export const top: ComponentGroup = {
  antenna: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="topAntenna-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="38" y="5" width="24" height="47"><path d="M38 38c0-1.1.9-2 2-2h20a2 2 0 0 1 2 2v14H38V38ZM48 5h4v31h-4z" fill="#fff"/></mask><g mask="url(#topAntenna-a)"><path d="M0 0h100v52H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 3h100v52H0V3Z" fill="#fff" fill-opacity=".3"/><path fill="#fff" fill-opacity=".2" d="M38 36h24v16H38z"/></g><circle cx="50" cy="8" r="8" fill="#FFE65C"/><circle cx="53" cy="5" r="3" fill="#fff"/>`,
  antennaCrooked: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="topAntennaCrooked-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="38" y="12" width="24" height="40"><g fill="#fff"><path d="M55.54 34.39 51 45h-3.74l4.92-10.44-6.05-10.43 3.22-11.84 2.9.8-2.9 10.62 6.2 10.68Z"/><path d="M38 39h24v13H38z"/></g></mask><g mask="url(#topAntennaCrooked-a)"><path d="M0 0h100v52H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 6h100v52H0V6Z" fill="#fff" fill-opacity=".3"/><path fill="#fff" fill-opacity=".2" d="M38 39h24v13H38z"/></g><circle cx="50" cy="8" r="8" fill="#FFE65C"/><circle cx="53" cy="5" r="3" fill="#fff"/>`,
  bulb01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="topBulb01-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="22" y="0" width="56" height="52"><g fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M32 16A16 16 0 0 1 48 0h4a16 16 0 0 1 16 16v16a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V16Z"/><rect x="22" y="40" width="56" height="12" rx="1"/></g></mask><g mask="url(#topBulb01-a)"><path d="M0 0h100v52H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#fff" fill-opacity=".4" d="M20-3h60v43H20z"/><path d="M49 3.5c4.93 0 9.37 2.13 12.44 5.52" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="m49.83 26-9-9L38 19.83l10 10V40h4V29.97l10.14-10.14L59.31 17l-9 9h-.48Z" fill="#fff" fill-opacity=".8"/></g>`,
  glowingBulb01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g filter="url(#topGlowingBulb01-a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M32 24A16 16 0 0 1 48 8h4a16 16 0 0 1 16 16v8a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-8Z" fill="#fff" fill-opacity=".3"/></g><path d="M49 11.5c4.93 0 9.37 2.13 12.44 5.52" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="m49.83 29-9-9L38 22.83l10 10V40h4v-7.03l10.14-10.14L59.31 20l-9 9h-.48Z" fill="#fff" fill-opacity=".8"/><rect x="22" y="40" width="56" height="12" rx="1" fill="#48494B"/><defs><filter id="topGlowingBulb01-a" x="24" y="0" width="52" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="4"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_617_621"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_617_621" result="shape"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/><feBlend in2="shape" result="effect2_innerShadow_617_621"/></filter></defs>`,
  glowingBulb02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g filter="url(#topGlowingBulb02-a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M30 33a20 20 0 1 1 40 0v11H30V33Z" fill="#fff" fill-opacity=".3"/></g><ellipse cx="50" cy="30" rx="4" ry="6" fill="#fff" fill-opacity=".6"/><path d="M50 15.5c4.93 0 9.37 2.13 12.44 5.52m2.43 3.5c.7 1.3 1.21 2.73 1.53 4.23" stroke="#fff" stroke-width="2" stroke-linecap="round"/><rect x="20" y="36" width="60" height="16" rx="1" fill="#48494B"/><defs><filter id="topGlowingBulb02-a" x="22" y="5" width="56" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="4"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_617_633"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_617_633" result="shape"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/><feBlend in2="shape" result="effect2_innerShadow_617_633"/></filter></defs>`,
  horns: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="topHorns-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="8" y="12" width="84" height="40"><g fill="#fff"><path d="M8 40h26v12H8z"/><path transform="matrix(-1 0 0 1 92 40)" d="M0 0h26v12H0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.52 13.74c0 7.84 5.39 20.71 13.72 27.04H11.36S7.84 22.66 13.43 14.1c.9-1.38 3.1-1.42 3.1-.36ZM84 14c.66 7.04-5.77 20.62-14 27h19s3.14-18.26-2-27c-1-1.7-3.14-1.45-3 0Z"/></g></mask><g mask="url(#topHorns-a)"><path d="M0 0h100v52H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#000" fill-opacity=".4" d="M0 40h100v12H0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.46 13h16.1v27H20.83c-7.45-7.85-5.36-27-5.36-27ZM84.82 13h7.75v27H81.82c5.75-7.8 3-27 3-27Z" fill="#fff" fill-opacity=".4"/></g>`,
  lights: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="topLights-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="22" width="80" height="30"><g fill="#fff"><path d="M10 42c0-1.1.9-2 2-2h76a2 2 0 0 1 2 2v10H10V42Z"/><path d="M18 27a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v25H18V27ZM42 27a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v25H42V27ZM66 27a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v25H66V27Z"/></g></mask><g mask="url(#topLights-a)"><path d="M0 0h100v52H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#fff" fill-opacity=".6" d="M0 0h100v40H0z"/><rect x="24" y="28" width="4" height="8" rx="2" fill="#fff" fill-opacity=".6"/><rect x="48" y="28" width="4" height="8" rx="2" fill="#fff" fill-opacity=".6"/><rect x="72" y="28" width="4" height="8" rx="2" fill="#fff" fill-opacity=".6"/></g>`,
  pyramid: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="topPyramid-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="18" y="8" width="64" height="44"><path fill-rule="evenodd" clip-rule="evenodd" d="m50 8 32 44H18L50 8Z" fill="#fff"/></mask><g mask="url(#topPyramid-a)"><path d="M0 0h100v52H0V0Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/><path fill="#fff" fill-opacity=".8" d="M50 4h30v48H50z"/></g>`,
  radar: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="topRadar-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="37" y="0" width="36" height="53"><g fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M43.8.11A20 20 0 1 0 72.08 28.4"/><circle cx="67.13" cy="5.06" r="4" transform="rotate(45 67.13 5.06)"/><path transform="rotate(45 64.3 6.48)" d="M64.31 6.48h2v26h-2z"/><path d="M47.94 28.11h4v24h-4z"/></g></mask><g mask="url(#topRadar-a)"><path d="M0 0h100v52H0V0Z" fill="#90A4AE"/><path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/><path fill-rule="evenodd" clip-rule="evenodd" d="M43.8.11A20 20 0 1 0 72.08 28.4" fill="#fff" fill-opacity=".2"/><circle cx="67.13" cy="7.41" r="5.66" transform="rotate(45 67.13 7.4)" fill="#fff" fill-opacity=".8"/></g>`,
};
