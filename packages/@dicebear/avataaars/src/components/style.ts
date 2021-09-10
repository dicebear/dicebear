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
    <path fill="#65C9FF" d="M12 40h240v240H12z"/>
  </g>
  <mask id="styleCircle-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="264" height="280">
    <path d="M264 0H0v160h12c0 66.274 53.726 120 120 120s120-53.726 120-120h12V0Z" fill="#000"/>
  </mask>
  <g mask="url(#styleCircle-b)">
    <path d="M132 36c-30.928 0-56 25.072-56 56v6.166c-5.675.952-10 5.888-10 11.834v14c0 6.052 4.48 11.058 10.305 11.881 2.067 19.806 14.458 36.541 31.695 44.73V199h-4c-39.764 0-72 32.236-72 72v9h200v-9c0-39.764-32.236-72-72-72h-4v-18.389c17.237-8.189 29.628-24.924 31.695-44.73C193.52 135.058 198 130.052 198 124v-14c0-5.946-4.325-10.882-10-11.834V92c0-30.928-25.072-56-56-56Z" fill="#D0C6AC"/>
    <mask id="styleCircle-c" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="32" y="36" width="200" height="244">
      <path d="M132 36c-30.928 0-56 25.072-56 56v6.166c-5.675.952-10 5.888-10 11.834v14c0 6.052 4.48 11.058 10.305 11.881 2.067 19.806 14.458 36.541 31.695 44.73V199h-4c-39.764 0-72 32.236-72 72v9h200v-9c0-39.764-32.236-72-72-72h-4v-18.389c17.237-8.189 29.628-24.924 31.695-44.73C193.52 135.058 198 130.052 198 124v-14c0-5.946-4.325-10.882-10-11.834V92c0-30.928-25.072-56-56-56Z" fill="#D0C6AC"/>
    </mask>
    <g mask="url(#styleCircle-c)">
      <path fill="${colors.skin.value}" d="M0 36h264v244H0z"/>
      <path d="M76 130v8c0 30.928 25.072 56 56 56s56-25.072 56-56v-8c0 30.928-25.072 56-56 56s-56-25.072-56-56Z" fill="#000" fill-opacity=".1"/>
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
  <path d="M132 36c-30.928 0-56 25.072-56 56v6.166c-5.675.952-10 5.888-10 11.834v14c0 6.052 4.48 11.058 10.305 11.881 2.067 19.806 14.458 36.541 31.695 44.73V199h-4c-39.764 0-72 32.236-72 72v9h200v-9c0-39.764-32.236-72-72-72h-4v-18.389c17.237-8.189 29.628-24.924 31.695-44.73C193.52 135.058 198 130.052 198 124v-14c0-5.946-4.325-10.882-10-11.834V92c0-30.928-25.072-56-56-56Z" fill="#D0C6AC"/>
  <mask id="styleDefault-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="32" y="36" width="200" height="244">
    <path d="M132 36c-30.928 0-56 25.072-56 56v6.166c-5.675.952-10 5.888-10 11.834v14c0 6.052 4.48 11.058 10.305 11.881 2.067 19.806 14.458 36.541 31.695 44.73V199h-4c-39.764 0-72 32.236-72 72v9h200v-9c0-39.764-32.236-72-72-72h-4v-18.389c17.237-8.189 29.628-24.924 31.695-44.73C193.52 135.058 198 130.052 198 124v-14c0-5.946-4.325-10.882-10-11.834V92c0-30.928-25.072-56-56-56Z" fill="#D0C6AC"/>
  </mask>
  <g mask="url(#styleDefault-a)">
    <path fill="${colors.skin.value}" d="M0 36h264v244H0z"/>
    <path d="M76 130v8c0 30.928 25.072 56 56 56s56-25.072 56-56v-8c0 30.928-25.072 56-56 56s-56-25.072-56-56Z" fill="#000" fill-opacity=".1"/>
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
