/**
 * The usage snippets of an avatar style: how to install DiceBear and render
 * one avatar with it, in every language DiceBear has a core for.
 *
 * Two consumers render these. StyleUsage.vue shows them as tabs on the style
 * pages, without a seed, so the placeholder comment points the reader at the
 * option table below. llms.ts writes them into the Markdown mirrors with an
 * example seed, so a snippet still runs after being pasted into a chat. Both
 * read from this module, so an API change is spelled once and a person and a
 * model reading the same style page see the same code.
 *
 * The per-style constants (`dicebear_styles::LORELEI`, `styles.Lorelei`,
 * `lorelei`) follow the case conventions the styles packages use when they
 * generate them, so deriving the spelling here is safe for any style name.
 */
import {
  camelCase,
  constantCase,
  kebabCase,
  pascalCase,
  snakeCase,
} from 'change-case';

export interface UsageSnippet {
  /** Stable identifier, also the tab value on the style pages. */
  readonly id: string;
  /** Language name as written in prose, e.g. `JavaScript`. */
  readonly label: string;
  /** Highlight language of {@link code}, where one applies. */
  readonly lang?: string;
  /** Command that installs the packages, where the ecosystem has one. */
  readonly install?: string;
  /** Code that loads the style and renders one avatar. */
  readonly code: string;
  /** Route of the library's documentation on this site. */
  readonly docs: string;
}

export interface UsageSnippetOptions {
  /** Major version of the release train, e.g. `10`. */
  readonly major: string;
  /**
   * Seed of the example call. Without one, the options argument becomes a
   * placeholder comment for the reader to fill in.
   */
  readonly seed?: string;
}

/** The URL that renders one avatar of the style via the HTTP API. */
export function httpApiUrl(
  styleName: string,
  { major, seed }: UsageSnippetOptions,
): string {
  const query = seed === undefined ? '' : `?seed=${seed}`;

  return `https://api.dicebear.com/${major}.x/${kebabCase(styleName)}/svg${query}`;
}

export function usageSnippets(
  styleName: string,
  options: UsageSnippetOptions,
): UsageSnippet[] {
  const { major, seed } = options;
  const file = kebabCase(styleName);

  /** The options argument of each call, in that language's syntax. */
  const arg = {
    js: seed === undefined ? '{\n  // ... options\n}' : `{ seed: '${seed}' }`,
    php:
      seed === undefined ? '[\n  // ... options\n]' : `['seed' => '${seed}']`,
    python:
      seed === undefined ? '{\n    # ... options\n}' : `{"seed": "${seed}"}`,
    rust:
      seed === undefined
        ? 'json!({\n  // ... options\n})'
        : `json!({ "seed": "${seed}" })`,
    go:
      seed === undefined
        ? 'map[string]any{\n\t// ... options\n}'
        : `map[string]any{"seed": "${seed}"}`,
    dart: seed === undefined ? '{\n  // ... options\n}' : `{'seed': '${seed}'}`,
  };

  return [
    {
      id: 'http-api',
      label: 'HTTP API',
      code: httpApiUrl(styleName, options),
      docs: '/how-to-use/http-api/',
    },
    {
      id: 'js-library',
      label: 'JavaScript',
      lang: 'js',
      install: 'npm install @dicebear/core @dicebear/styles --save',
      code: `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/${file}.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, ${arg.js});

const svg = avatar.toString();`,
      docs: '/how-to-use/js-library/',
    },
    {
      id: 'php-library',
      label: 'PHP',
      lang: 'php',
      install: 'composer require dicebear/core dicebear/styles',
      code: `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/${file}.json'));

$avatar = new Avatar($style, ${arg.php});

$svg = (string) $avatar;`,
      docs: '/how-to-use/php-library/',
    },
    {
      id: 'python-library',
      label: 'Python',
      lang: 'python',
      install: 'pip install dicebear-core dicebear-styles',
      code: `from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("${file}.json").read_text("utf-8")
)

avatar = Avatar(style, ${arg.python})

svg = avatar.to_string()`,
      docs: '/how-to-use/python-library/',
    },
    {
      id: 'rust-library',
      label: 'Rust',
      lang: 'rust',
      install: `cargo add dicebear-core serde_json\ncargo add dicebear-styles --features ${file}`,
      code: `use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::${constantCase(styleName)})?;
let avatar = Avatar::new(&style, ${arg.rust})?;

let svg = avatar.to_svg();`,
      docs: '/how-to-use/rust-library/',
    },
    {
      id: 'go-library',
      label: 'Go',
      lang: 'go',
      install: `go get github.com/dicebear/dicebear-go/v${major}\ngo get github.com/dicebear/styles/v${major}`,
      code: `import (
	dicebear "github.com/dicebear/dicebear-go/v${major}"
	"github.com/dicebear/styles/v${major}"
)

style, _ := dicebear.NewStyle([]byte(styles.${pascalCase(styleName)}))
avatar, _ := dicebear.NewAvatar(style, ${arg.go})

svg := avatar.SVG()`,
      docs: '/how-to-use/go-library/',
    },
    {
      id: 'dart-library',
      label: 'Dart',
      lang: 'dart',
      install: 'dart pub add dicebear_core dicebear_styles',
      code: `import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/${snakeCase(styleName)}.dart';

final style = Style.parse(${camelCase(styleName)});
final avatar = Avatar(style, ${arg.dart});

final svg = avatar.svg;`,
      docs: '/how-to-use/dart-library/',
    },
    {
      id: 'cli',
      label: 'CLI',
      install: 'npm install --global dicebear',
      code: `dicebear ${file}`,
      docs: '/how-to-use/cli/',
    },
  ];
}
