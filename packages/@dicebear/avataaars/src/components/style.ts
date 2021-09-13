import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const style: ComponentGroup = {
  circle: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <circle cx="132" cy="160" r="120" fill="#E6E6E6"/>
  <mask id="styleCircle-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="12" y="40" width="240" height="240">
    <circle cx="132" cy="160" r="120" fill="#fff"/>
  </mask>
  <g mask="url(#styleCircle-a)">
    <path d="M12 40h240v240H12V40Z" fill="${colors.background.value}"/>
  </g>
  <mask id="styleCircle-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="264" height="280">
    <path d="M264 0H0v160h12c0 66.27 53.73 120 120 120 66.27 0 120-53.73 120-120h12V0Z" fill="#000"/>
  </mask>
  <g mask="url(#styleCircle-b)">
    <path d="M132 36a56 56 0 0 0-56 56v6.17A12 12 0 0 0 66 110v14a12 12 0 0 0 10.3 11.88 56.04 56.04 0 0 0 31.7 44.73v18.4h-4a72 72 0 0 0-72 72v9h200v-9a72 72 0 0 0-72-72h-4v-18.39a56.04 56.04 0 0 0 31.7-44.73A12 12 0 0 0 198 124v-14a12 12 0 0 0-10-11.83V92a56 56 0 0 0-56-56Z" fill="#D0C6AC"/>
    <mask id="styleCircle-c" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="32" y="36" width="200" height="244">
      <path d="M132 36a56 56 0 0 0-56 56v6.17A12 12 0 0 0 66 110v14a12 12 0 0 0 10.3 11.88 56.04 56.04 0 0 0 31.7 44.73v18.4h-4a72 72 0 0 0-72 72v9h200v-9a72 72 0 0 0-72-72h-4v-18.39a56.04 56.04 0 0 0 31.7-44.73A12 12 0 0 0 198 124v-14a12 12 0 0 0-10-11.83V92a56 56 0 0 0-56-56Z" fill="#D0C6AC"/>
    </mask>
    <g mask="url(#styleCircle-c)">
      <path fill="${colors.skin.value}" d="M0 36h264v244H0z"/>
      <path d="M76 130v8a56 56 0 1 0 112 0v-8a56 56 0 1 1-112 0Z" fill="#000" fill-opacity=".1"/>
    </g>
    <g transform="translate(0 170)">
      ${components.clothing?.value(components, colors) ?? ''}
    </g>
    <g transform="translate(78 134)">
      ${components.mouth?.value(components, colors) ?? ''}
    </g>
    <g transform="translate(104 122)">
      ${components.nose?.value(components, colors) ?? ''}
    </g>
    <g transform="translate(76 90)">
      ${components.eyes?.value(components, colors) ?? ''}
    </g>
    <g transform="translate(76 82)">
      ${components.eyebrows?.value(components, colors) ?? ''}
    </g>
    <g>
      <mask id="styleCircle-d" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="264" height="280">
        <path fill="#fff" d="M0 0h264v280H0z"/>
      </mask>
      <g mask="url(#styleCircle-d)">
        <g transform="translate(-1)">
          ${components.top?.value(components, colors) ?? ''}
        </g>
      </g>
    </g>
  </g>
`,
  default: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M132 36a56 56 0 0 0-56 56v6.17A12 12 0 0 0 66 110v14a12 12 0 0 0 10.3 11.88 56.04 56.04 0 0 0 31.7 44.73v18.4h-4a72 72 0 0 0-72 72v9h200v-9a72 72 0 0 0-72-72h-4v-18.39a56.04 56.04 0 0 0 31.7-44.73A12 12 0 0 0 198 124v-14a12 12 0 0 0-10-11.83V92a56 56 0 0 0-56-56Z" fill="#D0C6AC"/>
  <mask id="styleDefault-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="32" y="36" width="200" height="244">
    <path d="M132 36a56 56 0 0 0-56 56v6.17A12 12 0 0 0 66 110v14a12 12 0 0 0 10.3 11.88 56.04 56.04 0 0 0 31.7 44.73v18.4h-4a72 72 0 0 0-72 72v9h200v-9a72 72 0 0 0-72-72h-4v-18.39a56.04 56.04 0 0 0 31.7-44.73A12 12 0 0 0 198 124v-14a12 12 0 0 0-10-11.83V92a56 56 0 0 0-56-56Z" fill="#D0C6AC"/>
  </mask>
  <g mask="url(#styleDefault-a)">
    <path fill="${colors.skin.value}" d="M0 36h264v244H0z"/>
    <path d="M76 130v8a56 56 0 1 0 112 0v-8a56 56 0 1 1-112 0Z" fill="#000" fill-opacity=".1"/>
  </g>
  <g transform="translate(0 170)">
    ${components.clothing?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(78 134)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(104 122)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(76 90)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(76 82)">
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
  <g>
    <mask id="styleDefault-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="264" height="280">
      <path fill="#fff" d="M0 0h264v280H0z"/>
    </mask>
    <g mask="url(#styleDefault-b)">
      <g transform="translate(-1)">
        ${components.top?.value(components, colors) ?? ''}
      </g>
    </g>
  </g>
`,
};
