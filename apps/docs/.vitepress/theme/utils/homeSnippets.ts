/**
 * The code samples of the home page demo. They are the usage snippets of the
 * style pages with the demo's options filled in, so the code on the page
 * always draws the avatar next to it.
 *
 * The seed can be wrapped in the marks of `codeMarks`. A code card turns them
 * into a highlight, so the reader finds their own input in the code.
 */
import { generateCodeExamples } from '@theme/utils/code-examples';
import { getAvatarApiCommand, getAvatarApiUrl } from '@theme/utils/avatar/api';
import { usageSnippets } from '@theme/config/usageSnippets';
import { marked } from '@theme/utils/codeMarks';

export interface DemoSnippet {
  id: string;
  label: string;
  lang?: string;
  install?: string;
  code: string;
  docs: string;
}

const PLACEHOLDER = '__seed__';

/** The call each usage snippet makes for the placeholder seed. */
const CALLS: Record<string, { from: string; key: string }> = {
  'js-library': {
    from: `new Avatar(style, { seed: '${PLACEHOLDER}' });`,
    key: 'js',
  },
  'php-library': {
    from: `new Avatar($style, ['seed' => '${PLACEHOLDER}']);`,
    key: 'php',
  },
  'python-library': {
    from: `Avatar(style, {"seed": "${PLACEHOLDER}"})`,
    key: 'python',
  },
  'rust-library': {
    from: `Avatar::new(&style, json!({ "seed": "${PLACEHOLDER}" }))?;`,
    key: 'rust',
  },
  'go-library': {
    from: `dicebear.NewAvatar(style, map[string]any{"seed": "${PLACEHOLDER}"})`,
    key: 'go',
  },
  'dart-library': {
    from: `Avatar(style, {'seed': '${PLACEHOLDER}'});`,
    key: 'dart',
  },
  'csharp-library': {
    from: `new Avatar(style, new JsonObject { ["seed"] = "${PLACEHOLDER}" });`,
    key: 'csharp',
  },
};

/** The API URL of the demo, with the seed marked where asked for. */
export function demoUrl(
  styleName: string,
  options: Record<string, unknown>,
  mark = false,
): string {
  const url = getAvatarApiUrl(styleName, options);

  if (!mark || typeof options.seed !== 'string' || options.seed === '') {
    return url;
  }

  const encoded = encodeURIComponent(options.seed);

  return url.replace(`seed=${encoded}`, `seed=${marked(encoded)}`);
}

export function demoSnippets(
  styleName: string,
  options: Record<string, unknown>,
  major: string,
  mark = false,
): DemoSnippet[] {
  const seed = typeof options.seed === 'string' ? options.seed : '';
  const shown =
    mark && seed !== '' ? { ...options, seed: marked(seed) } : options;
  const examples = generateCodeExamples(styleName, shown) as unknown as Record<
    string,
    string
  >;

  return usageSnippets(styleName, { major, seed: PLACEHOLDER }).map(
    (snippet) => {
      if (snippet.id === 'http-api') {
        const url = demoUrl(styleName, options, mark);

        return {
          ...snippet,
          lang: 'html',
          code: `<img\n  src="${url}"\n  alt="Avatar"\n/>`,
        };
      }

      if (snippet.id === 'cli') {
        // The shell quotes the seed, so the marks go around the quoted value.
        const command = getAvatarApiCommand(styleName, options);

        return {
          ...snippet,
          code:
            mark && seed !== ''
              ? command.replace(
                  /(--seed )(.+?)(?= \\$|$)/m,
                  `$1${marked('$2')}`,
                )
              : command,
        };
      }

      const call = CALLS[snippet.id];

      return {
        ...snippet,
        code: call
          ? snippet.code.replace(call.from, examples[call.key])
          : snippet.code,
      };
    },
  );
}
