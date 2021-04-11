export const eyebrows = {
  down: (color: string) => `
    <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
  `,
  eyelashesDown: (color: string) => `
    <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0M37.148 26.458L31 21.03m85.219-11.586l1.785-8.005M45.597 22.814l-4.046-7.132m66.591-6.664L109.08.87M52.674 17.2l-2.201-7.9m49.52-1.269l-.776-8.164" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
  `,
  eyelashesUp: (color: string) => `
    <path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699m-21.068 8.636l-6.148-5.427m103.035-12.874l6.148-5.427M32.523 23.814l-4.046-7.132m87.035-9.169l4.047-7.132M40.6 20.2l-2.202-7.9m68.038-5.4l2.201-7.9" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
  `,
  up: (color: string) => `
    <path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
  `,
};
