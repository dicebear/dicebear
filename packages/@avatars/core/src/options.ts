import * as expr from './expr';
import * as prng from './prng';
import type * as style from './style';

export function process<O extends style.IStyleOptions>(options: O) {
  let processedOptions = { ...options };
  let prngInstance = prng.create(typeof processedOptions.seed === 'string' ? processedOptions.seed : '');

  let keys = Object.keys(processedOptions) as Array<keyof O>;

  keys.forEach((key) => {
    if (processedOptions.hasOwnProperty(key)) {
      processedOptions[key] = expr.resolve(processedOptions[key], processedOptions, prngInstance, [key as string]);
    }
  });

  return processedOptions;
}
