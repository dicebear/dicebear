export default {
  backgroundColor: {
    type: 'color',
    defaultValue: '#ffffff',
    alias: 'b',
  },
  radius: {
    type: 'range',
    values: [0, 50],
    defaultValue: 0,
    alias: 'r',
  },
  size: {
    type: 'number',
    values: [0, 2048],
    defaultValue: 0,
  },
  scale: {
    type: 'range',
    values: [0, 200],
    defaultValue: 100,
  },
  flip: {
    type: 'switch',
    values: [0, 1],
    defaultValue: 0,
  },
  rotate: {
    type: 'range',
    values: [0, 360],
    defaultValue: 0,
  },
  translateX: {
    type: 'range',
    values: [-100, 100],
    defaultValue: 0,
  },
  translateY: {
    type: 'range',
    values: [-100, 100],
    defaultValue: 0,
  },
};
