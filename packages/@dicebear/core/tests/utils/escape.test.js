import { xml as escapeXml } from '../../lib/utils/escape.js';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test('XML must be escaped.', () => {
  equal(
    escapeXml(`<script type="text/javascript">alert('Bad code')></script>`),
    `&lt;script type=&quot;text/javascript&quot;&gt;alert(&apos;Bad code&apos;)&gt;&lt;/script&gt;`
  );
});

test.run();
