import * as yup from 'yup';
import defaults from './defaults';

export default yup.object({
  ...defaults,
  backgroundColors: yup
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
  backgroundColorLevel: yup.number().oneOf([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
  fontSize: yup.number().min(1).max(100),
  chars: yup.number().min(0).max(2),
  bold: yup.number().oneOf([0, 1]),
});
