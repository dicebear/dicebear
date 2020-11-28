import * as yup from 'yup';

const radius = yup.number().min(0).max(50);
const margin = yup.number().min(0).max(25);
const background = yup.string().matches(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
const width = yup.number().min(1);
const height = yup.number().min(1);

export default {
  radius: radius,
  r: radius,
  margin: margin,
  m: margin,
  background: background,
  b: background,
  width: width,
  w: width,
  height: height,
  h: height,
};
