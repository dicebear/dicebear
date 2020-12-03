import defaults from './defaults';

export default {
  ...defaults,
  colors: {
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
  colorLevel: {
    type: 'select',
    values: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    defaultValue: 600
  }
};
