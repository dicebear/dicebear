import defaults from './defaults';

export default {
  ...defaults,
  colorful: {
    type: 'switch',
    values: [0, 1],
    defaultValue: 0
  },
  deterministic: {
    type: 'switch',
    values: [0, 1],
    defaultValue: 0
  }
};
