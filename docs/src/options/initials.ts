import defaults from './defaults';

export default {
  ...defaults,
  backgroundColors: {
    type: 'checkbox',
    values: [
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
      'yellow'
    ],
    defaultValue: []
  },
  backgroundColorLevel: {
    type: 'select',
    values: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    defaultValue: 600
  },
  fontSize: {
    type: 'range',
    values: [1, 100],
    defaultValue: 50
  },
  chars: {
    type: 'range',
    values: [0, 2],
    defaultValue: 2
  },
  bold: {
    type: 'switch',
    values: [0, 1],
    defaultValue: 0
  }
};
