import * as yup from 'yup';
import defaults from './defaults';

export default yup.object({
  ...defaults,
  mood: yup.array().of(yup.string().oneOf(['happy', 'sad', 'surprised'])),
});
