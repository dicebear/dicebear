export function encode(value: string) {
  // @see https://www.base64encoder.io/javascript/
  let utf8Bytes = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode(parseInt(`0x${p1}`));
  });

  return typeof btoa !== 'undefined' ? btoa(utf8Bytes) : Buffer.from(utf8Bytes, 'base64').toString('utf-8');
}
