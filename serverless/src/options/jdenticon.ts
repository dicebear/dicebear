import * as yup from 'yup';
import defaults from './defaults';

export default yup.object({
  ...defaults,
  hues: yup.array().of(yup.number().min(0).max(360)),
  colorLightness: yup.array().min(2).max(2).of(yup.number().min(0).max(100)),
  grayscaleLightness: yup.array().min(2).max(2).of(yup.number().min(0).max(100)),
  colorSaturation: yup.number().min(0).max(100),
  grayscaleSaturation: yup.number().min(0).max(100),
});
