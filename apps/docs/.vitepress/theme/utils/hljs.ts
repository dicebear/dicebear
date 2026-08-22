type Hljs = typeof import('highlight.js/lib/core').default;

let hljsPromise: Promise<Hljs> | null = null;

export function loadHljs(): Promise<Hljs> {
  return (hljsPromise ??= (async () => {
    const [
      { default: core },
      { default: javascript },
      { default: xml },
      { default: json },
      { default: php },
      { default: python },
      { default: rust },
      { default: go },
      { default: dart },
      { default: csharp },
    ] = await Promise.all([
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/json'),
      import('highlight.js/lib/languages/php'),
      import('highlight.js/lib/languages/python'),
      import('highlight.js/lib/languages/rust'),
      import('highlight.js/lib/languages/go'),
      import('highlight.js/lib/languages/dart'),
      import('highlight.js/lib/languages/csharp'),
    ]);

    for (const [name, language] of [
      ['js', javascript],
      ['html', xml],
      ['json', json],
      ['php', php],
      ['python', python],
      ['rust', rust],
      ['go', go],
      ['dart', dart],
      ['csharp', csharp],
    ] as const) {
      core.registerLanguage(name, language);
    }

    return core;
  })());
}

export type { Hljs };
