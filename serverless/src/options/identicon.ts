import * as yup from 'yup';
import defaults from './defaults';

export default yup.object({
  ...defaults,
  colors: yup
    .array()
    .of(
      yup
        .string()
        .oneOf([
          'amber',
          'blue',
          'blueGrey',
          'brown',
          'cyan',
          'deepOrange',
          'deepPurple',
          'green',
          'grey',
          'indigo',
          'lightBlue',
          'lightGreen',
          'lime',
          'orange',
          'pink',
          'purple',
          'red',
          'teal',
          'yellow',
        ])
    ),
  colorLevel: yup.number().oneOf([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
});
