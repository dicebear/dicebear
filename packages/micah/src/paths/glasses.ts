export const glasses = {
  round: (color: string) => `
    <g stroke="${color}" stroke-width="4">
      <circle cx="122.5" cy="28" r="26"/>
      <circle cx="55.5" cy="37" r="26"/>
      <path d="M97.5 35a8 8 0 00-16 0M30 39L0 44.5"/>
    </g>
  `,
  square: (color: string) => `
    <g stroke="${color}" stroke-width="4">
      <path d="M34.5 42.5L0 49.125" stroke-linecap="round"/>
      <path d="M30.488 25.94a6 6 0 014.984-7.405l38.716-5.442a6 6 0 016.777 5.107l5.567 39.61a6 6 0 01-5.107 6.777l-34.472 4.845a6 6 0 01-6.654-4.478l-9.811-39.015zM152.751 8.964a6 6 0 00-6.832-5.744l-38.716 5.44a6 6 0 00-5.107 6.777l5.567 39.611a6 6 0 006.777 5.107l34.472-4.845a6 6 0 005.162-6.139l-1.323-40.207zM83.5 37.125l22-3.5"/>
    </g>
  `,
};
