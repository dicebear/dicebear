import * as yup from 'yup';
import defaults from './defaults';

export default yup.object({
  ...defaults,
  colorful: yup.number().oneOf([0, 1]),
  deterministic: yup.number().oneOf([0, 1]),
});
