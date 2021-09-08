export function decodeHtmlEntitites(str: string): string {
  return str
    .replace(/(&amp;|&#38;)/g, '&')
    .replace(/(&lt;|&#60;)/g, '<')
    .replace(/(&gt;|&#62;)/g, '>')
    .replace(/(&quot;|&#34;)/g, '"')
    .replace(/&#39;/g, "'");
}
