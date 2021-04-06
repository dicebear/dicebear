export function attr(attr: string) {
  return attr
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function text(str: string) {
  return /[&<>]/.test(str) ? `<![CDATA[${str.replace(/]]>/, ']]]]><![CDATA[>')}]]>` : str;
}
