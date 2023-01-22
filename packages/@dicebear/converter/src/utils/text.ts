let encoder: TextEncoder;
let decoder: TextDecoder;

export function getEncoder() {
  if (!encoder) {
    encoder = new TextEncoder();
  }

  return encoder;
}

export function getDecoder() {
  if (!decoder) {
    decoder = new TextDecoder();
  }

  return decoder;
}
