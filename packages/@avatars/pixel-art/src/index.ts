import { IStyle } from '@avatars/core';
import male from './male';
import female from './male';
import IOptions from './options';

const style: IStyle<IOptions> = function (random, options = {}) {
  let gender = options.gender || random.pick(['male', 'female']);

  switch (gender) {
    case 'male':
      return male(random, options);

    case 'female':
      return female(random, options);

    default:
      throw new Error('Unsupported gender.');
  }
};

export default style;
