import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const face: ComponentGroup = {
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M73.714 127.458c1.565-7.324 4.064-12.071 7.06-16.638.035-.112.083-.221.145-.327 2.925-4.944 8.893-9.453 16.362-13.028 7.515-3.597 16.736-6.34 26.408-7.637 19.003-2.551 40.181.431 53.487 14.053.237.061.462.182.652.364 7.783 7.47 9.482 18.453 9.188 30.282-.011.432-.024.867-.04 1.303 1.487.307 3.343 1.254 4.775 3.168 1.834 2.45 2.853 6.305 1.862 12.066-.43 2.501-.923 4.09-1.567 5.504-.384.843-.847 1.662-1.343 2.538-.277.491-.564.999-.853 1.54-.707 1.32-1.51 2.806-2.6 3.714-.594.494-1.316.86-2.183.941-.293.027-.585.02-.877-.017-.2 2.146-.371 4.277-.496 6.385-2.187 36.958-4.655 59.814-22.109 79.198-16.882 18.747-43.576 13.371-56.954.058-10.756-10.704-28.535-32.965-32.01-83.46-1.903.338-3.712-.901-5.12-3.008-1.543-2.309-2.958-6.09-4.033-11.786-1.032-5.465-.283-9.335 1.517-11.882a8.246 8.246 0 0 1 6.77-3.524c.203 0 .397.042.573.117.304-3.794.773-7.053 1.386-9.924Z" fill="${
    colors.base.value
  }"/>
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M186.418 136.234c2.238 0 8.261 2.671 6.343 13.766-.842 4.87-1.878 5.906-3.668 9.233-1.514 2.813-2.735 4.84-5.48 3.522M70.397 137.803c-3.813 0-8.954 3.22-6.948 13.797 2.154 11.351 5.56 14.377 7.83 13.699"/>
    <path d="M82.16 108.404c-7.185 10.414-11.794 19.513-9.5 56.596 3.213 51.899 21.394 74.456 32.204 85.161 13.18 13.049 39.297 18.138 55.713 0 17.334-19.153 19.857-41.718 22.084-79.161 1.478-24.861 9.352-52.816-5.5-67"/>
  </g>
  <g transform="translate(117 131)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(63 147)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(100 194)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(0 -34)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(72 160)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(72 89)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M176.975 104.198c.119.126.212.267.278.416.374.101.707.347.907.713 3.744 6.851 6.698 16.624 8.105 27.643 4.651-1.535 11.735 1.979 11.735 10.099 0 3.874-.279 6.651-.926 8.927-.658 2.313-1.674 4.028-3.013 5.804-1.966 2.607-5.261 3.419-7.801 3.334-2.446 18.548-10.12 37.085-26.107 49.17-12.247 9.257-25.265 12.803-37.177 11.4-11.913-1.404-22.593-7.746-30.16-18.023-9.933-13.488-16.337-28.232-19.484-42.236-1.539.121-3.79-.055-6.033-1.227-2.97-1.55-5.69-4.72-6.812-10.603-1.02-5.344-.43-9.946 1.693-12.964 1.077-1.531 2.54-2.634 4.32-3.159 1.52-.447 3.193-.452 4.952-.034 1.185-10.605 4.788-19.619 10.75-25.548.092-.091.192-.167.299-.229 3.23-3.896 8.358-7.441 14.51-10.355 7.471-3.538 16.637-6.235 26.251-7.512 19.152-2.544 40.524.507 53.713 14.384Z" fill="${
    colors.base.value
  }"/>
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M82.26 108c-17 17-15 61 11 96.5 15.013 20.5 42.215 25.128 66.724 6.5 34.478-26.205 30.499-83 17.999-106"/>
    <path d="M187.367 134.414c3.607-1.866 10.718.813 10.718 8.667 0 7.853-1.131 10.781-3.727 14.242-1.917 2.556-5.524 3.128-7.86 2.714M70.655 134.881c-7.607-2.389-12.19 4.071-10.183 14.649 2.153 11.351 10.183 11.316 12.493 10.81"/>
  </g>
  <g transform="translate(112 123)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(60 128)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(95 180)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-1 -13)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(67 152)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(71 102)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M177.753 106c11.376 21.844 19.288 64.991 13.488 72.291C177.969 195 111.979 200 88.851 185.156c-15.452-9.917-16.433-61.162-8.216-74.892M186.014 122.686c2.899-1.035 8.509-3.798 9.812 1.811 1.303 5.609 1.283 9.099 0 14.907-.699 3.164-2.337 4.11-4.304 4.11"/>
    <path d="M75.163 125.338c-7.606-2.389-12.086 1.888-9.36 11.337 2.583 8.95 7.051 10.834 9.36 10.328"/>
  </g>
  <g transform="translate(112 122)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(63 112)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(98 168)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-3 -1)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(68 149)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(71 103)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M75.32 123.476c2.008-5.448 3.916-9.729 5.362-12.217a1.45 1.45 0 0 1 .168-1.081c2.917-4.872 8.868-9.314 16.316-12.837 7.494-3.544 16.689-6.246 26.333-7.525 19.213-2.549 40.653.507 53.883 14.409.259.272.392.617.402.964.988 1.122 2.257 3.232 3.626 5.974 1.36 2.724 2.877 6.192 4.382 10.204a11.309 11.309 0 0 1 4.653-.426c2.002.249 4.147 1.15 5.361 3.246 2.037 3.518 2.877 9.932 1.561 15.85-.418 1.882-1.319 3.241-2.526 4.113a6.066 6.066 0 0 1-2.371 1.02c.526 2.781.973 5.625 1.315 8.504 2.779 23.356-1.253 49.592-25.988 62.6-23.569 12.395-46.976 16.081-65.598 12.323-18.654-3.764-32.576-15.041-36.705-32.488-3.197-13.511-1.26-31.045 2.242-46.718-1.527-.286-2.942-1.407-3.935-2.998-1.307-2.094-2.05-5.187-1.725-9.229.499-6.198 2.158-10.521 4.805-12.795 1.358-1.166 2.943-1.76 4.637-1.773 1.274-.011 2.554.306 3.802.88Z" fill="${
    colors.base.value
  }"/>
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M81.071 110.699c-6.098 10.056-22.299 57.651-15.55 86.369 8.092 34.429 54.531 44.899 102.099 19.71 48.722-25.799 16.585-104.236 9.66-111.778"/>
    <path d="M186.31 122.447c2.588-1.153 7.412-1.298 9.256 1.909 1.844 3.207 2.71 9.385 1.427 15.193-.717 3.246-2.955 4.228-4.922 4.228M74.476 124.787c-5.846-3.492-11.406-.213-12.403 12.257-.627 7.84 2.922 11.331 5.416 10.975"/>
  </g>
  <g transform="translate(116 120)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(57 132)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(86 184)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-2 -17)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(71 151)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(71 89)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M75.886 125.022c1.232-5.713 2.807-10.664 4.761-14.337a1.47 1.47 0 0 1 .177-.46c2.902-4.883 8.823-9.335 16.233-12.866 7.455-3.552 16.603-6.26 26.198-7.542 19.113-2.553 40.443.509 53.606 14.442.314.332.442.773.388 1.193 2.089 3.98 4.248 9.844 6.223 16.881 1.343-.517 3.018-.887 4.666-.778 1.926.127 3.949.932 5.161 3.039 2.083 3.624 2.188 9.14.67 15.44-.537 2.23-1.649 3.724-3.025 4.635a6.809 6.809 0 0 1-2.454.995c1.238 7.833 2.129 16.109 2.48 24.335.561 13.173-.262 26.293-3.314 37.281-3.048 10.971-8.382 20.029-17.011 24.722-18.324 9.965-38.663 12.216-55.895 7.93-17.234-4.286-31.46-15.15-37.277-31.47-3.787-10.625-5.537-30.289-5.1-49.542.064-2.825.176-5.647.335-8.437l-.05.009c-.822.117-1.697.06-2.558-.293-.863-.353-1.62-.967-2.262-1.822-1.25-1.665-2.122-4.327-2.602-8.223-.69-5.608.155-10.034 2.235-12.768 1.057-1.39 2.435-2.337 4.04-2.711 1.41-.327 2.898-.192 4.375.347Z" fill="${
    colors.base.value
  }"/>
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80.904 110.314c-10.418 19.382-10.78 77.782-3.213 98.999 11.51 32.276 56.411 43.348 93.316 23.288 33.33-18.117 18.061-104.955 6.13-127.601"/>
    <path d="M184.901 123.238c2.589-1.154 6.883-1.752 8.728 1.455 1.844 3.208 2.054 8.382.528 14.71-.941 3.902-3.738 4.766-5.705 4.766M74.656 126.001c-5.88-2.578-10.794 2.577-9.425 13.692.962 7.806 3.407 9.64 5.901 9.284"/>
  </g>
  <g transform="translate(115 126)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(61 138)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(98 188)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-2 -23)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(71 156)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(70 84)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M75.03 128.424c1.202-6.455 3.064-12.418 5.682-17.62.016-.217.083-.433.202-.633 2.919-4.87 8.873-9.312 16.326-12.833 7.498-3.543 16.698-6.244 26.347-7.523 18.974-2.514 40.12.43 53.394 13.87.297.097.565.287.754.562 3.569 5.173 5.282 11.963 5.444 21.928.009.587.013 1.185.012 1.794.901-.063 1.887-.025 2.873.273 1.537.466 2.906 1.511 3.976 3.357.616 1.064.876 2.389.942 3.719.067 1.353-.06 2.837-.319 4.311-.514 2.931-1.582 6.01-2.891 8.176-2.249 3.72-4.68 4.686-6.255 4.987a1.391 1.391 0 0 1-.256.027 582.535 582.535 0 0 1-2.092 14.918c-4.165 27.407-11.025 49.419-19.175 64.937-4.075 7.759-8.495 13.939-13.103 18.358-4.604 4.416-9.464 7.137-14.402 7.82-8.816 1.218-24.813-4.583-41.248-35.537-8.265-15.568-14.506-36.508-16.885-57.109a159.222 159.222 0 0 1-.961-12.6c-1.61-.094-3.18-1.052-4.416-2.348-1.505-1.578-2.748-3.877-3.327-6.674-1.39-6.708-.455-11.284 1.825-13.943 2.083-2.43 5.066-2.989 7.553-2.217Z" fill="${
    colors.base.value
  }"/>
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M182.838 129.138c2.311-.365 4.88-.368 6.725 2.839 1.844 3.208.141 11.054-2.296 15.117-2.066 3.442-4.171 4.187-5.369 4.418M73.939 129.658c-4.24-1.94-11.052 1.233-8.305 14.599 1.078 5.246 4.587 8.399 7.08 8.042"/>
    <path d="M80.916 110.414c-14.601 29.019-5.999 82.679 10.64 114.264 16.64 31.585 32.458 36.809 40.48 35.692 18.473-2.572 37.818-36.215 46.272-92.269 5.666-37.571 5.584-54.169-1.216-64.101"/>
  </g>
  <g transform="translate(117 128)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(62 148)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(97 191)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(0 -31)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(70 157)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(72 80)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M123.36 89.319c18.884-2.522 39.925.423 53.158 13.876.204.033.404.11.586.233 2.901 1.955 4.619 4.206 5.921 7.485 1.058 2.664 1.858 6.057 2.844 10.525 1.349.07 3.581.437 5.395 2.095 2.194 2.004 3.37 5.496 2.384 11.201-.84 4.861-1.666 7.625-3.516 11.064-.778 1.447-1.807 2.938-3.129 3.884-1.41 1.01-3.173 1.395-5.067.493a297.313 297.313 0 0 1-3.54 10.874c-5.223 15.102-11.624 30.216-14.983 35.814-4.749 7.917-9.695 15.043-15.237 20.197-5.563 5.174-11.816 8.44-19.135 8.44-2.689 0-5.612-1.267-8.566-3.256-2.985-2.009-6.166-4.868-9.406-8.307-6.482-6.883-13.334-16.233-19.475-26.187-6.142-9.958-11.607-20.572-15.297-30.004-.46-1.176-.894-2.336-1.297-3.475a1.735 1.735 0 0 1-.167.061c-1.58.472-3.752.312-5.76-1.614-1.923-1.844-3.589-5.205-4.666-10.881-2.069-10.909 4.171-17.286 9.144-17.286.058 0 .116.004.173.011.983-4.14 1.852-6.88 2.746-8.903 1.205-2.725 2.485-4.176 3.94-5.824.355-.403.722-.818 1.1-1.267.086-.102.184-.19.29-.263 3.149-4.318 8.621-8.248 15.303-11.43 7.472-3.559 16.64-6.272 26.257-7.556Z" fill="${
    colors.base.value
  }"/>
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M186.481 122.647c2.238 0 8.973.752 7.055 11.846-.842 4.87-1.647 7.526-3.436 10.852-1.514 2.814-3.679 5.141-6.424 3.823M72.268 125.843c-3.813 0-9.878 5.308-7.871 15.885 2.153 11.351 6.483 12.29 8.752 11.611"/>
    <path d="M81.55 108.976c-4.13 4.898-5.759 4.898-9.738 25.698-3.978 20.8 38.72 91.332 57.17 91.332 13.976 0 24.173-12.417 33.845-28.537 6.692-11.154 26.003-61.27 23.368-73.272-2.634-12.001-3.541-16.567-8.927-20.197"/>
  </g>
  <g transform="translate(116 119)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(60 131)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(97 178)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-1 -14)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(72 148)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(72 92)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80.652 114.924c-6.088 8.802-10.764 34.418-.56 51 11.585 22.533 35.353 28.955 59.629 26.679 24.276-2.276 41.56-22.215 45.705-38.052 4.145-15.838 0-35.343-8.382-45.551"/>
    <path d="M183.22 118.377c2.589-1.154 5.557-1.698 7.401 1.509 1.845 3.207 3.179 7.326 1.653 13.653-.941 3.903-3.279 4.815-5.246 4.815M74.996 124.629c-4.24-1.941-9.13 2.25-7.761 13.366.961 7.806 3.973 9.554 6.467 9.198"/>
  </g>
  <g transform="translate(113 126)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(62 112)">
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(98 169)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-2 4)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(69 153)">
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(72 106)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
};
