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
  colorful: {
    type: 'switch',
    values: [0, 1],
    defaultValue: 0
  },
  primaryColorLevel: {
    type: 'select',
    values: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    defaultValue: 600
  },
  secondaryColorLevel: {
    type: 'select',
    values: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    defaultValue: 400
  },
  textureChance: {
    type: 'range',
    values: [0, 100],
    defaultValue: 50
  },
  mouthChance: {
    type: 'range',
    values: [0, 100],
    defaultValue: 100
  },
  sidesChance: {
    type: 'range',
    values: [0, 100],
    defaultValue: 100
  },
  topChange: {
    type: 'range',
    values: [0, 100],
    defaultValue: 100
  }
};
