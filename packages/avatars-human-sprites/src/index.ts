import Male from '@dicebear/avatars-male-sprites';
import Female from '@dicebear/avatars-female-sprites';
import Random from '@dicebear/avatars/lib/random';

type Options = {
  mood?: Array<'happy' | 'sad' | 'surprised'>;
};

export function create(random: Random, options: Options = {}) {
  if (random.bool(50)) {
    return Male(random, options);
  } else {
    return Female(random, options);
  }
}

export default create;
