import Male from '@avatars/male';
import Female from '@avatars/female';
import Random from '@avatars/core/lib/random';

type Options = {
  mood?: Array<'happy' | 'sad' | 'surprised'>;
};

export default function (random: Random, options: Options = {}) {
  if (random.bool(50)) {
    return Male(random, options);
  } else {
    return Female(random, options);
  }
}
