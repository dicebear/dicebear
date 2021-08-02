export default {
  radius: {
    type: "range",
    values: [0, 50],
    defaultValue: 0,
    alias: "r",
  },
  margin: {
    type: "range",
    values: [0, 25],
    defaultValue: 0,
    alias: "m",
  },
  background: {
    type: "color",
    defaultValue: "#ffffff",
    alias: "b",
  },
  width: {
    type: "number",
    values: [0, 2048],
    defaultValue: 0,
    alias: "w",
  },
  height: {
    type: "number",
    values: [0, 2048],
    defaultValue: 0,
    alias: "h",
  },
};
