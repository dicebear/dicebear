/**
 * The state of one named animation as the core resolves it: its own
 * `${name}Animation` switch when set, the global `animation` switch
 * otherwise.
 */
export function animationSwitch(
  options: Record<string, unknown>,
  name: string,
): boolean | undefined {
  const own = options[`${name}Animation`];

  return typeof own === 'boolean' ? own : undefined;
}

export function animationPlays(
  options: Record<string, unknown>,
  name: string,
): boolean {
  return animationSwitch(options, name) ?? options.animation === true;
}
