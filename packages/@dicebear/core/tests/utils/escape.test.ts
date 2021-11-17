import { xml as escapeXml } from '../../src/utils/escape';

test('XML must be escaped.', () => {
  expect(escapeXml(`<script type="text/javascript">alert('Bad code')></script>`)).toEqual(
    `&lt;script type=&quot;text/javascript&quot;&gt;alert(&apos;Bad code&apos;)&gt;&lt;/script&gt;`
  );
});
