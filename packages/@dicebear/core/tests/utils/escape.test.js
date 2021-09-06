import * as escape from '../../lib/utils/escape.js';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test('XML must be escaped.', () => {
  equal(
    escape.xml(`<script type="text/javascript">alert('Bad code')></script>`),
    `&lt;script type=&quot;text/javascript&quot;&gt;alert(&apos;Bad code&apos;)&gt;&lt;/script&gt;`
  );
});

test('Markdown must be escaped.', () => {
  equal(
    escape.md(
      `*This is evil code* <script type="text/javascript">alert('Bad code')></script>`
    ),
    `\\*This is evil code\\* &lt;script type=&quot;text/javascript&quot;&gt;alert\\(&apos;Bad code&apos;\\)&gt;&lt;/script&gt;`
  );
});

test.run();
