export function xml(content: string) {
  return content
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function md(content: string) {
  const result = content.replace(/([\\`*_{}[\]()#+-.!])/g, '\\$1');

  return xml(result);
}
