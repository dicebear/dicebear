let maskId = 0;

export function next() {
  return `mask${++maskId}`;
}

export function current() {
  return `mask${maskId}`;
}

export function reset() {
  maskId = 0;
}
