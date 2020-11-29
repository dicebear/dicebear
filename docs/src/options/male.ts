import defaults from './defaults';

export default {
  ...defaults,
  mood: {
    type: 'checkbox',
    values: ['happy', 'sad', 'surprised'],
    defaultValue: []
  }
};
