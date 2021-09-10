import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const eyes: ComponentGroup = {
  variant32: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="#000" stroke-linecap="round">
    <path d="M68 60.133C72.297 56.755 78.904 50 91.79 50c10.948 0 20.155 7.43 21.807 10.133" stroke-width="8.275"/>
    <path d="M68 97.132C72.295 93.755 78.903 87 91.79 87c10.948 0 20.154 7.43 21.806 10.132" stroke-width="4.138"/>
    <path d="M177 60.133C181.295 56.755 187.903 50 200.789 50c10.949 0 20.155 7.43 21.807 10.133" stroke-width="8.275"/>
    <path d="M177 97.132C181.295 93.755 187.903 87 200.789 87c10.949 0 20.155 7.43 21.807 10.132" stroke-width="4.138"/>
  </g>
`,
  variant31: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="#000" stroke-linecap="round">
    <path d="M222.054 49c-4.296 3.378-10.904 10.133-23.79 10.133-10.948 0-20.154-7.43-21.806-10.133" stroke-width="8.275"/>
    <path d="M222.054 89c-4.296 3.378-10.904 10.132-23.79 10.133-10.948 0-20.154-7.43-21.806-10.133" stroke-width="4.138"/>
    <path d="M110.596 49c-4.295 3.377-10.903 10.132-23.79 10.133C75.86 59.133 66.653 51.702 65 49" stroke-width="8.275"/>
    <path d="M110.596 89c-4.295 3.378-10.903 10.132-23.79 10.133C75.86 99.133 66.653 91.703 65 89" stroke-width="4.138"/>
  </g>
`,
  variant30: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#161616">
    <path d="M206.111 81.555c0 6.382-5.174 11.556-11.556 11.556-6.382 0-11.555-5.174-11.555-11.556C183 75.173 188.173 70 194.555 70s11.556 5.174 11.556 11.555Z"/>
    <circle cx="93.555" cy="81.555" r="11.555"/>
  </g>
`,
  variant29: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <circle cx="196.177" cy="81.555" r="11.555" fill="#161616"/>
  <circle cx="96.177" cy="81.555" r="11.555" fill="#161616"/>
  <path d="M180 70c.88 2.465 3.962 7.765 9.244 9.244M80 70c.88 2.465 3.962 7.765 9.244 9.244" stroke="#000" stroke-width="4.622" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant28: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#000">
    <path d="M187 75.933a6.933 6.933 0 1 1 13.866 0V89.8a6.933 6.933 0 1 1-13.866 0V75.933ZM88 75.933a6.933 6.933 0 1 1 13.866 0V89.8A6.933 6.933 0 0 1 88 89.8V75.933Z"/>
  </g>
`,
  variant27: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M92.43 79.866a6.933 6.933 0 1 1 13.867 0v13.867a6.933 6.933 0 1 1-13.867 0V79.866ZM190.429 79.866a6.934 6.934 0 0 1 13.867 0v13.867a6.933 6.933 0 1 1-13.867 0V79.866Z" fill="#000"/>
  <path d="M83.185 66c-.77 3.081.462 10.169 11.555 13.866M181.185 66c-.77 3.081.462 10.169 11.555 13.866" stroke="#000" stroke-width="4.622" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant26: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M178.435 52.749c3.709-2.917 9.414-8.749 20.54-8.749 9.454 0 17.403 6.416 18.829 8.749M67.385 52.749C71.093 49.832 76.799 44 87.925 44c9.453 0 17.402 6.416 18.829 8.749" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <circle cx="88.433" cy="90.762" r="28.433" fill="#fff"/>
  <circle cx="198.669" cy="90.762" r="28.433" fill="#fff"/>
  <circle cx="88.433" cy="90.762" r="15.31" fill="#000"/>
  <circle cx="198.669" cy="90.762" r="15.31" fill="#000"/>
`,
  variant25: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#fff">
    <path d="M75.056 75.047A23.806 23.806 0 0 0 69 90.947c0 13.197 10.698 23.895 23.896 23.895 10.817 0 19.955-7.187 22.899-17.047l-40.74-22.746ZM211.109 75.047a23.805 23.805 0 0 1 6.056 15.899c0 13.197-10.698 23.895-23.895 23.895-10.817 0-19.956-7.187-22.9-17.047l40.739-22.747Z"/>
  </g>
  <g stroke="#000" stroke-width="3.676" stroke-linecap="round">
    <path d="M74.5 52.5c7.5 5 40 26 49 31.5M213 53c-7.5 5-40 26-49 31.5"/>
  </g>
  <path d="M75 53c7.5 5 40 26 49 31.5M213.5 53.5c-7.5 5-40 26-49 31.5" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
`,
  variant24: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M178.435 52.749c3.709-2.917 9.414-8.749 20.54-8.749 9.454 0 17.403 6.416 18.829 8.749M67.385 52.749C71.093 49.832 76.799 44 87.925 44c9.453 0 17.402 6.416 18.829 8.749" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <circle cx="88.433" cy="90.762" r="28.433" fill="#fff"/>
  <circle cx="198.669" cy="90.762" r="28.433" fill="#fff"/>
  <circle cx="88.433" cy="90.762" r="15.31" fill="#757575"/>
  <circle cx="198.669" cy="90.762" r="15.31" fill="#757575"/>
`,
  variant23: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M51 66.63C57.87 64.42 68.439 60 89.048 60c17.511 0 32.236 4.862 34.878 6.63M164 66.63c6.87-2.21 17.439-6.63 38.048-6.63 17.511 0 32.236 4.862 34.878 6.63" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <path d="M120.611 94.806s-24.071 11.602-35.434 11.602c-11.364 0-30.863-11.602-30.863-11.602S76.1 83.204 87.464 83.204s33.148 11.602 33.148 11.602ZM233.612 94.806s-24.071 11.602-35.434 11.602c-11.364 0-30.863-11.602-30.863-11.602s21.786-11.602 33.149-11.602 33.148 11.602 33.148 11.602Z" fill="#fff"/>
  <circle cx="89.12" cy="94.806" r="11.602" fill="#000"/>
  <circle cx="198.806" cy="94.806" r="11.602" fill="#000"/>
`,
  variant22: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M78.206 51.352C81.323 48.902 86.118 44 95.47 44c7.944 0 14.625 5.392 15.823 7.352M179.165 51.352c3.117-2.45 7.912-7.352 17.262-7.352 7.945 0 14.626 5.392 15.824 7.352" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <rect x="72" y="64.733" width="43.313" height="52.938" rx="14.438" fill="#fff"/>
  <rect x="173" y="64.733" width="43.313" height="52.938" rx="14.438" fill="#fff"/>
  <path d="M184 76.678c0-6.697 5.481-12.097 12.176-11.999l10 .147c6.558.097 11.824 5.44 11.824 11.999V106c0 6.627-5.373 12-12 12h-10c-6.627 0-12-5.373-12-12V76.678ZM83 76.678c0-6.697 5.48-12.097 12.177-11.999l9.999.147c6.558.097 11.824 5.44 11.824 11.999V106c0 6.627-5.373 12-12 12H95c-6.627 0-12-5.373-12-12V76.678Z" fill="#757575"/>
  <rect x="90.619" y="76.238" width="18.619" height="28.963" rx="9.309" fill="#000"/>
  <rect x="191.619" y="76.238" width="18.619" height="28.963" rx="9.309" fill="#000"/>
`,
  variant21: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M75 52.389C78.556 49.593 84.027 44 94.696 44c9.064 0 16.686 6.152 18.054 8.389M179.577 52.389c3.556-2.796 9.027-8.389 19.696-8.389 9.064 0 16.686 6.152 18.054 8.389" stroke="#000" stroke-width="4.194" stroke-linecap="round"/>
  <rect x="72" y="60.361" width="49.418" height="60.4" rx="16.473" fill="#fff"/>
  <rect x="173.582" y="60.361" width="49.418" height="60.4" rx="16.473" fill="#fff"/>
  <rect x="81.441" y="68.766" width="30.2" height="46.673" rx="15.1" fill="#757575"/>
  <rect x="182.937" y="68.766" width="30.2" height="46.673" rx="15.1" fill="#757575"/>
  <rect x="88.522" y="78.375" width="16.523" height="25.964" rx="8.261" fill="#000"/>
  <rect x="190.018" y="78.375" width="16.523" height="25.964" rx="8.261" fill="#000"/>
`,
  variant20: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M76 52.422C79.57 49.615 85.063 44 95.774 44c9.1 0 16.752 6.176 18.125 8.422M180 52.422c3.57-2.807 9.063-8.422 19.774-8.422 9.1 0 16.752 6.176 18.125 8.422" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <rect x="71" y="61.477" width="49.614" height="60.639" rx="14.438" fill="#fff"/>
  <rect x="172.983" y="61.477" width="49.614" height="60.639" rx="14.438" fill="#fff"/>
  <rect x="82.025" y="69.746" width="30.32" height="46.858" rx="9.625" fill="#000"/>
  <rect x="181.253" y="69.746" width="30.32" height="46.858" rx="9.625" fill="#000"/>
`,
  variant19: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M76 52.422C79.57 49.615 85.063 44 95.774 44c9.1 0 16.752 6.176 18.125 8.422M180 52.422c3.57-2.807 9.063-8.422 19.774-8.422 9.1 0 16.752 6.176 18.125 8.422" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <rect x="71" y="61.477" width="49.614" height="60.639" rx="14.438" fill="#fff"/>
  <rect x="172.983" y="61.477" width="49.614" height="60.639" rx="14.438" fill="#fff"/>
  <rect x="82.025" y="69.746" width="30.32" height="46.858" rx="9.625" fill="#757575"/>
  <rect x="181.253" y="69.746" width="30.32" height="46.858" rx="9.625" fill="#757575"/>
`,
  variant18: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M120.889 100.473s-24.275 11.7-35.734 11.7c-11.46 0-31.124-11.7-31.124-11.7s21.97-11.7 33.429-11.7c11.46 0 33.429 11.7 33.429 11.7ZM235.286 100.473s-24.276 11.7-35.735 11.7-31.124-11.7-31.124-11.7 21.97-11.7 33.429-11.7c11.46 0 33.43 11.7 33.43 11.7Z" fill="#fff"/>
  <circle cx="89.131" cy="100.473" r="11.7" fill="#000"/>
  <circle cx="200.185" cy="100.473" r="11.7" fill="#000"/>
  <path fill="#403E3E" d="M49 52h76.887v20.058H49zM161.429 52h76.887v20.058h-76.887z"/>
`,
  variant17: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#000">
    <path d="M74 93.087h40.439v11.029H74zM74 60h40.439v11.029H74zM173.259 93.087h40.439v11.029h-40.439zM173.259 60h40.439v11.029h-40.439z"/>
  </g>
`,
  variant16: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#000">
    <path d="M74 81.087h40.439v36.763H74zM74 48h40.439v11.029H74zM173.259 81.087h40.439v36.763h-40.439zM173.259 48h40.439v11.029h-40.439z"/>
  </g>
`,
  variant15: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <ellipse cx="92.309" cy="93.833" rx="19.711" ry="32.16" fill="#fff"/>
  <ellipse cx="195.95" cy="93.833" rx="18.673" ry="32.16" fill="#fff"/>
  <ellipse cx="96.459" cy="93.833" rx="15.561" ry="25.935" fill="#000"/>
  <ellipse cx="191.8" cy="92.796" rx="14.524" ry="24.898" fill="#000"/>
  <path d="M63 48.28C64.933 46.896 75.984 40 92 40c16.017 0 30.934 6.895 29.001 8.28 0 16.017-2.968 0-28.102 0-27.067 0-29.899 16.017-29.899 0ZM167 48.28c1.934-1.385 12.984-8.28 29.001-8.28 16.016 0 30.933 6.895 29 8.28 0 16.017-2.968 0-28.102 0-27.067 0-29.899 16.017-29.899 0Z" fill="#000"/>
`,
  variant14: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <ellipse cx="93.322" cy="94.652" rx="20.804" ry="33.943" fill="#fff"/>
  <ellipse cx="192.109" cy="94.652" rx="20.804" ry="33.943" fill="#fff"/>
  <ellipse cx="93.323" cy="94.653" rx="16.424" ry="27.373" fill="#000"/>
  <ellipse cx="192.109" cy="94.653" rx="16.424" ry="27.373" fill="#000"/>
  <path d="M64 44.397C65.96 42.992 77.167 36 93.41 36c16.241 0 31.369 6.992 29.408 8.397 0 16.243-3.01 0-28.498 0-27.448 0-30.32 16.243-30.32 0ZM166 44.397C167.961 42.992 179.167 36 195.409 36c16.242 0 31.37 6.992 29.409 8.397 0 16.243-3.01 0-28.498 0-27.448 0-30.32 16.243-30.32 0Z" fill="#000"/>
`,
  variant13: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M58.683 45.332C60.86 43.77 73.315 36 91.365 36c18.05 0 34.861 7.77 32.682 9.332 0 18.05-3.345 0-31.67 0-30.503 0-33.694 18.05-33.694 0ZM165.683 45.332C167.862 43.77 180.315 36 198.365 36c18.05 0 34.861 7.77 32.682 9.332 0 18.05-3.345 0-31.67 0-30.503 0-33.694 18.05-33.694 0Z" fill="#000"/>
  <path d="M87.268 69.11c1.239-3.811 6.632-3.811 7.87 0l3.265 10.047a4.138 4.138 0 0 0 3.935 2.859h10.563c4.008 0 5.674 5.129 2.432 7.485l-8.546 6.209a4.138 4.138 0 0 0-1.503 4.626l3.264 10.046c1.239 3.812-3.124 6.982-6.367 4.626l-8.546-6.209a4.136 4.136 0 0 0-4.864 0l-8.545 6.209c-3.243 2.356-7.606-.814-6.367-4.626l3.264-10.046a4.138 4.138 0 0 0-1.503-4.626l-8.546-6.21c-3.243-2.355-1.576-7.484 2.432-7.484h10.563a4.137 4.137 0 0 0 3.935-2.859l3.264-10.046ZM194.845 69.11c1.238-3.811 6.631-3.811 7.87 0l3.264 10.047a4.137 4.137 0 0 0 3.935 2.859h10.563c4.008 0 5.675 5.129 2.432 7.485l-8.546 6.209a4.138 4.138 0 0 0-1.503 4.626l3.264 10.046c1.239 3.812-3.124 6.982-6.367 4.626l-8.545-6.209a4.136 4.136 0 0 0-4.864 0l-8.546 6.209c-3.243 2.356-7.606-.814-6.367-4.626l3.264-10.046a4.138 4.138 0 0 0-1.503-4.626l-8.546-6.21c-3.243-2.355-1.576-7.484 2.432-7.484h10.563a4.137 4.137 0 0 0 3.935-2.859l3.265-10.046Z" fill="#FFEBB7"/>
`,
  variant12: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="#000" stroke-linecap="round">
    <g stroke-width="7">
      <path d="M106.086 43c-3.682 2.895-9.347 8.686-20.393 8.686-9.385 0-17.277-6.37-18.693-8.686M184.886 43c3.682 2.895 9.346 8.686 20.392 8.686 9.385 0 17.277-6.37 18.693-8.686"/>
    </g>
    <path d="m73 74 35.5 15.5L73 110M220.5 74 185 89.5l35.5 20.5" stroke-width="4" stroke-linejoin="round"/>
  </g>
`,
  variant11: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="#000" stroke-linecap="round">
    <g stroke-width="7">
      <path d="M184.886 51.686C188.568 48.79 194.232 43 205.278 43c9.385 0 17.277 6.37 18.693 8.686M106.086 51.686C102.404 48.79 96.739 43 85.693 43 76.308 43 68.416 49.37 67 51.686"/>
    </g>
    <path d="m73 74 35.5 15.5L73 110M220.5 74 185 89.5l35.5 20.5" stroke-width="4" stroke-linejoin="round"/>
  </g>
`,
  variant10: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M55.26 43.19C57.405 41.654 69.67 34 87.447 34c17.776 0 34.333 7.653 32.187 9.19 0 17.777-3.294 0-31.19 0-30.042 0-33.184 17.777-33.184 0ZM169.259 43.19c2.146-1.537 14.411-9.19 32.188-9.19 17.776 0 34.333 7.653 32.187 9.19 0 17.777-3.294 0-31.19 0-30.042 0-33.185 17.777-33.185 0Z" fill="#000"/>
  <path d="m87.203 56.64 8.129 25.015h26.303l-21.28 15.461 8.128 25.016-21.28-15.461-21.28 15.461 8.129-25.016-21.28-15.46h26.303l8.128-25.017ZM200.986 56.64l8.128 25.015h26.303l-21.28 15.461 8.128 25.016-21.279-15.461-21.28 15.461 8.128-25.016-21.28-15.46h26.303l8.129-25.017Z" fill="#FFEBB7"/>
`,
  variant09: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#000">
    <path d="M56 44.41C58.197 42.836 70.755 35 88.956 35c18.2 0 35.152 7.836 32.955 9.41 0 18.2-3.373 0-31.934 0-30.759 0-33.977 18.2-33.977 0ZM166.883 44.41c2.197-1.574 14.755-9.41 32.955-9.41 18.201 0 35.153 7.836 32.956 9.41 0 18.2-3.373 0-31.935 0-30.758 0-33.976 18.2-33.976 0Z"/>
  </g>
  <ellipse cx="88" cy="97.5" rx="29" ry="17.5" fill="#fff"/>
  <mask id="eyesVariant09-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="59" y="80" width="58" height="35">
    <ellipse cx="88" cy="97.5" rx="29" ry="17.5" fill="#fff"/>
  </mask>
  <g mask="url(#eyesVariant09-a)">
    <circle cx="74" cy="98" r="18" fill="#000"/>
  </g>
  <g>
    <ellipse cx="198" cy="97.5" rx="29" ry="17.5" fill="#fff"/>
    <mask id="eyesVariant09-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="169" y="80" width="58" height="35">
      <ellipse cx="198" cy="97.5" rx="29" ry="17.5" fill="#fff"/>
    </mask>
    <g mask="url(#eyesVariant09-b)">
      <circle cx="184" cy="98" r="18" fill="#000"/>
    </g>
  </g>
`,
  variant08: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <ellipse rx="29" ry="17.5" transform="matrix(-1 0 0 1 88 97.5)" fill="#fff"/>
  <mask id="eyesVariant08-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="59" y="80" width="58" height="35">
    <ellipse rx="29" ry="17.5" transform="matrix(-1 0 0 1 88 97.5)" fill="#fff"/>
  </mask>
  <g mask="url(#eyesVariant08-a)">
    <circle r="18" transform="matrix(-1 0 0 1 102 98)" fill="#000"/>
  </g>
  <g fill="#000">
    <path d="M57 43.41C59.197 41.836 71.755 34 89.956 34c18.2 0 35.152 7.836 32.955 9.41 0 18.2-3.373 0-31.934 0-30.759 0-33.977 18.2-33.977 0ZM167.883 43.41c2.197-1.574 14.755-9.41 32.955-9.41 18.201 0 35.153 7.836 32.956 9.41 0 18.2-3.373 0-31.935 0-30.758 0-33.976 18.2-33.976 0Z"/>
  </g>
  <g>
    <ellipse rx="29" ry="17.5" transform="matrix(-1 0 0 1 198 97.5)" fill="#fff"/>
    <mask id="eyesVariant08-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="169" y="80" width="58" height="35">
      <ellipse rx="29" ry="17.5" transform="matrix(-1 0 0 1 198 97.5)" fill="#fff"/>
    </mask>
    <g mask="url(#eyesVariant08-b)">
      <circle r="18" transform="matrix(-1 0 0 1 212 98)" fill="#000"/>
    </g>
  </g>
`,
  variant07: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M183.127 52.686C186.809 49.79 192.474 44 203.52 44c9.385 0 17.277 6.37 18.693 8.686M104.328 52.686C100.646 49.79 94.981 44 83.935 44c-9.385 0-17.277 6.37-18.693 8.686" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <circle cx="87.228" cy="92.044" r="28.229" fill="#fff"/>
  <circle cx="200.772" cy="92.044" r="28.229" fill="#fff"/>
  <circle cx="87.229" cy="92.044" r="15.2" fill="#000"/>
  <circle cx="200.771" cy="92.044" r="15.2" fill="#000"/>
  <path d="M228.264 86.636h-55.952c1.851-13.798 13.671-24.44 27.976-24.44s26.125 10.642 27.976 24.44ZM114.953 86.636H59c1.851-13.798 13.671-24.44 27.976-24.44s26.125 10.642 27.977 24.44Z" fill="#CD9166"/>
`,
  variant06: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M183.127 52.686C186.809 49.79 192.474 44 203.52 44c9.385 0 17.277 6.37 18.693 8.686M104.328 52.686C100.646 49.79 94.981 44 83.935 44c-9.385 0-17.277 6.37-18.693 8.686" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <circle cx="87.228" cy="92.044" r="28.229" fill="#fff"/>
  <circle cx="200.772" cy="92.044" r="28.229" fill="#fff"/>
  <circle cx="87.229" cy="92.044" r="15.2" fill="#757575"/>
  <circle cx="200.771" cy="92.044" r="15.2" fill="#757575"/>
  <path d="M228.264 86.636h-55.952c1.851-13.798 13.671-24.44 27.976-24.44s26.125 10.642 27.976 24.44ZM114.953 86.636H59c1.851-13.798 13.671-24.44 27.976-24.44s26.125 10.642 27.977 24.44Z" fill="#CD9166"/>
`,
  variant05: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <circle cx="198.968" cy="93.312" r="11.555" fill="#161616"/>
  <circle cx="90.968" cy="93.312" r="11.555" fill="#161616"/>
  <path d="M175 68.244C179.354 65.163 186.053 59 199.115 59c11.099 0 20.432 6.78 22.106 9.244M67 68.244C71.354 65.163 78.053 59 91.115 59c11.099 0 20.432 6.78 22.106 9.244" stroke="#000" stroke-width="9.244" stroke-linecap="round"/>
`,
  variant04: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <circle cx="202.177" cy="92.555" r="11.555" fill="#161616"/>
  <circle cx="89.177" cy="92.555" r="11.555" fill="#161616"/>
  <path d="M177 68.244C181.354 65.163 188.053 59 201.115 59c11.099 0 20.432 6.78 22.106 9.244M64 68.244C68.354 65.163 75.053 59 88.115 59c11.099 0 20.432 6.78 22.106 9.244" stroke="#000" stroke-width="4.622" stroke-linecap="round"/>
  <path d="M186 81c.88 2.465 3.962 7.765 9.244 9.244M73 81c.88 2.465 3.962 7.765 9.244 9.244" stroke="#000" stroke-width="4.622" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant03: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M171.189 63.244C175.543 60.163 182.242 54 195.305 54c11.098 0 20.431 6.78 22.105 9.244M71 63.244C75.354 60.163 82.053 54 95.115 54c11.099 0 20.432 6.78 22.106 9.244" stroke="#000" stroke-width="9.244" stroke-linecap="round"/>
  <path d="M187.739 89.434a6.933 6.933 0 0 1 6.934-6.933 6.933 6.933 0 0 1 6.933 6.933v13.867a6.933 6.933 0 0 1-13.867 0V89.435ZM87.55 89.434a6.933 6.933 0 1 1 13.866 0v13.867a6.933 6.933 0 0 1-13.866 0V89.435Z" fill="#000"/>
`,
  variant02: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M71 65.244C74.919 62.163 80.948 56 92.704 56c9.989 0 18.388 6.78 19.895 9.244M171 65.244c3.919-3.081 9.948-9.244 21.704-9.244 9.989 0 18.388 6.78 19.895 9.244" stroke="#000" stroke-width="4.622" stroke-linecap="round"/>
  <path d="M88.704 90.093a6.933 6.933 0 1 1 13.866 0v13.866a6.933 6.933 0 0 1-13.866 0V90.093ZM188.704 90.093a6.933 6.933 0 1 1 13.866 0v13.866a6.933 6.933 0 1 1-13.866 0V90.093Z" fill="#000"/>
  <path d="M79.46 76.226c-.77 3.082.462 10.169 11.555 13.867M179.46 76.226c-.77 3.082.462 10.169 11.555 13.867" stroke="#000" stroke-width="4.622" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant01: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M76.056 75.547A23.806 23.806 0 0 0 70 91.447c0 13.197 10.698 23.896 23.896 23.896 10.817 0 19.955-7.188 22.9-17.048l-40.74-22.746ZM212.109 75.547a23.805 23.805 0 0 1 6.056 15.899c0 13.197-10.698 23.896-23.896 23.896-10.817 0-19.955-7.188-22.899-17.048l40.739-22.746Z" fill="#fff"/>
  <path d="M74.5 52.5c7.5 5 40 26 49 31.5M213 53c-7.5 5-40 26-49 31.5" stroke="#000" stroke-width="3.676" stroke-linecap="round"/>
  <path d="M86.14 81.178a12.847 12.847 0 0 0-5.111 10.268c0 7.106 5.76 12.867 12.867 12.867 6.696 0 12.198-5.116 12.81-11.652L86.14 81.178ZM202.024 81.178a12.848 12.848 0 0 1 5.112 10.268c0 7.106-5.761 12.867-12.867 12.867-6.697 0-12.198-5.116-12.811-11.652l20.566-11.483Z" fill="#000"/>
`,
};
