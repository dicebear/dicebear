let encoder: TextEncoder;

export function getEncoder() {
  if (!encoder) {
    encoder = new TextEncoder();
  }

  return encoder;
}
