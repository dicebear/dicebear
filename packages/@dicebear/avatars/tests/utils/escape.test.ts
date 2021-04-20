import { utils } from '../../lib';

test('XML must be escaped.', () => {
  expect(utils.escape.xml(`<script type="text/javascript">alert('Bad code')></script>`)).toEqual(
    `&lt;script type=&quot;text/javascript&quot;&gt;alert(&apos;Bad code&apos;)&gt;&lt;/script&gt;`
  );
});
