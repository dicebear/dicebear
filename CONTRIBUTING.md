# Contributing

Thanks for your interest in contributing to DiceBear.

This is the main monorepo: the JavaScript, PHP, and Python core libraries, the
CLI, the docs site, and the editor all live here. Repositories covering the JSON Schema,
the avatar style definitions, the HTTP API, and the Figma exporter are separate
and each have their own `CONTRIBUTING.md`:

- [`dicebear/schema`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md):
  JSON Schema for definitions and options
- [`dicebear/styles`](https://github.com/dicebear/styles/blob/main/CONTRIBUTING.md):
  Official avatar style definitions
- [`dicebear/api`](https://github.com/dicebear/api/blob/main/CONTRIBUTING.md):
  Self-hostable HTTP API
- [`dicebear/exporter-plugin-for-figma`](https://github.com/dicebear/exporter-plugin-for-figma/blob/main/CONTRIBUTING.md):
  Figma plugin

If your contribution belongs to one of those repos, read its file first. The
instructions below only cover this monorepo.

## Before you start

- Bug fixes, small improvements, new tests: open a pull request against the
  branch that matches the target major (for DiceBear 10 that's `10.x`; the
  current stable line lives on `9.x`).
- New avatar styles: contribute them to
  [`dicebear/styles`](https://github.com/dicebear/styles), not here. The
  walkthrough is in
  [Create an avatar style with Figma](https://www.dicebear.com/guides/create-an-avatar-style-with-figma/)
  or
  [Create an avatar style from scratch](https://www.dicebear.com/guides/create-an-avatar-style-from-scratch/).
- Larger changes (new public API, rendering behavior, breaking changes): open an
  issue first so we can agree on scope before you spend time on it.
- Security issues go privately to <contact@dicebear.com>; never file a public
  issue for a vulnerability.
- Contributors follow the
  [DiceBear Code of Conduct](https://github.com/dicebear/.github/blob/main/CODE_OF_CONDUCT.md).

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer (CI runs on 20, 22, 24, 25)
- npm 11 (this repo pins `packageManager` in `package.json`; use
  [Corepack](https://nodejs.org/api/corepack.html) if you don't already)
- For PHP work: PHP 8.2+ and Composer, plus `vendor/bin/phpunit` via
  `composer install` inside `src/php/core/`
- For Python work: Python 3.10+ (CI runs on 3.10–3.14); install the package in a
  virtualenv with `pip install -e ".[dev]"` inside `src/python/core/`

## Local setup

```sh
git clone git@github.com:dicebear/dicebear.git
cd dicebear
npm install
```

The monorepo uses npm workspaces (`src/js/*` and `apps/*`) driven by
[Turborepo](https://turborepo.com/). A single install at the root is enough; do
not `npm install` inside individual packages.

## Common scripts

Run these from the repo root:

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run build`        | Builds every workspace via Turbo                    |
| `npm test`             | Runs every workspace's test target                  |
| `npm run test:scripts` | Runs the repo-level scripts in `tests/**/*.test.js` |
| `npm run lint`         | Runs ESLint across the repo with caching            |
| `npm run lint:fix`     | Same, with `--fix`                                  |
| `npm run prettier`     | Formats `src/` and `apps/` with Prettier            |

For faster loops, scope to a single workspace:

```sh
npm run build --workspace @dicebear/core
npm run test  --workspace @dicebear/core
```

## Repository layout

```
src/
├── js/              # TypeScript packages published to npm
│   ├── core/          # Rendering engine (@dicebear/core)
│   ├── cli/           # Command-line interface
│   └── converter/     # SVG → raster converter
├── php/             # PHP port (Composer package `dicebear/core`)
└── python/          # Python port (PyPI package `dicebear-core`)
apps/
├── docs/            # VitePress documentation site (dicebear.com), including the Playground
└── editor/          # The in-browser editor (editor.dicebear.com)
tests/
└── fixtures/parity/ # Cross-language parity fixtures (see below)
scripts/
└── version.mjs      # Bumps versions across the workspace and tags
```

## Working on a package

### TypeScript packages (`src/js/*`)

```sh
npm run build --workspace <package>
npm run test  --workspace <package>
```

If you are working on the CLI, call the compiled script directly once you've
built it:

```sh
node src/js/cli/bin/index.js <command>
```

### PHP core (`src/php/core/`)

```sh
cd src/php/core
composer install
vendor/bin/phpunit
```

### Python core (`src/python/core/`)

```sh
cd src/python/core
pip install -e ".[dev]"   # in a virtualenv
ruff check .
ruff format --check .
mypy src
pytest
```

The Python core reads the two draft-07 schemas from the `dicebear-schema`
package (the Python counterpart of `@dicebear/schema` / `dicebear/schema`), which
`pip install -e ".[dev]"` pulls in as a runtime dependency — nothing is vendored.

### Cross-language parity

`@dicebear/core` (JS), `dicebear/core` (PHP), and `dicebear-core` (Python) must
produce **byte-identical** output for the same inputs. A shared fixture suite in
`tests/fixtures/parity/` enforces this, and all three sides consume it:

- JS side: `src/js/core/tests/Parity.test.js`, run via
  `npm run test --workspace @dicebear/core`.
- PHP side: `tests/ParityTest.php`, run via `vendor/bin/phpunit` in
  `src/php/core/`.
- Python side: `tests/test_parity.py`, run via `pytest` in `src/python/core/`.

The fixtures cover `Fnv1a` (hash + hex), `Mulberry32` (chained sequences), every
`Prng` method, number-to-string formatting (`numbers.json` — the `formatNumber`
contract: every emitted number rounded to at most 5 decimal places, which the
JS, PHP, and Python helpers must reproduce identically), and full
`Avatar.toString()` output for the `initials`, `thumbs`, `glass`, and
`notionists` styles. That last bucket covers seed, size, transforms, gradients,
and component-variant overrides.

If your change affects rendering or the PRNG in `@dicebear/core`, regenerate the
fixtures from the JS reference and commit the diff:

```sh
npm run fixtures:parity
```

The PHP and Python suites will then fail loudly until those sides are brought
back in sync.
That is the intended signal. If you only intend to touch one language, expect to
update both before your PR can be merged.

When porting DiceBear to another language, run these fixtures against your
implementation to prove it conforms. See
[Implement DiceBear Core](https://www.dicebear.com/specification/implement-dicebear-core/)
for the full spec.

## Documentation changes (`apps/docs/`)

The docs site is a VitePress app under `apps/docs/`.

```sh
npm run dev --workspace @dicebear/docs    # live reload on localhost
npm run build --workspace @dicebear/docs  # production build check
```

For larger editorial changes, open a draft PR early so reviewers can follow
along.

## Editor changes (`apps/editor/`)

The editor is the standalone app served at
[editor.dicebear.com](https://editor.dicebear.com).

```sh
npm run dev --workspace @dicebear/editor
npm run build --workspace @dicebear/editor
```

## Code style

- ESLint and Prettier decide what counts as correctly formatted code; run
  `npm run lint` and `npm run prettier` before you open a PR.
- TypeScript is `strict`. Prefer narrow types to `any` / `unknown` casts.
- PHP code follows PSR-12; `vendor/bin/phpunit` and Composer's built-in scripts
  catch the rest.
- Python code is formatted and linted with [Ruff](https://docs.astral.sh/ruff/)
  and type-checked with `mypy` in strict mode; run `ruff check .`,
  `ruff format .`, and `mypy src` in `src/python/core/` before you open a PR.

## Releasing (maintainers only)

> Only maintainers with write access can release new versions. This section is
> documented here for completeness.

Releases are triggered by Git tags. The version script updates every package in
the workspace, creates a commit, and creates the tag:

```sh
node scripts/version.mjs <version>
```

The version must be a valid [semver](https://semver.org/) value (e.g. `10.1.0`
or `10.2.0-alpha.1`). The script will:

1. Update `version` in every `package.json` across the workspace
2. Update internal workspace dependency references
3. Update `version` in `src/python/core/pyproject.toml` (the Python core is not
   an npm workspace, so it is bumped explicitly to stay in lockstep)
4. Sync `package-lock.json`
5. Create a Git commit and tag (e.g. `v10.1.0`)

Push the commit and the tag:

```sh
git push && git push --tags
```

The tag triggers the
[Publish](https://github.com/dicebear/dicebear/actions/workflows/publish.yml)
workflow, which:

1. Runs the test suite on Node 20, 22, 24, and 25
2. Builds every package
3. Picks the npm dist-tag:
   - Tags containing `alpha`, `beta`, or `rc` go out as `next`
   - Other tags on the default branch go out as `latest`
   - Other tags on any other branch go out as `v<major>-lts` (so that
     backporting a patch to `9.x` after `10.x` has shipped does not overwrite
     `latest`)
4. Publishes all changed packages to npm via `scripts/publish.mjs`
5. Builds `src/python/core` and publishes `dicebear-core` to PyPI via trusted
   publishing (the `publish-python` job) — no token and no separate repository,
   the same way the npm packages go out

The PHP port is the exception: Composer/Packagist consumes one Git repository
per package rather than a monorepo subdirectory, so `split-php-core.yml` mirrors
`src/php/core` (tags included) to the standalone
[`dicebear/dicebear-php`](https://github.com/dicebear/dicebear-php) repository,
and Packagist publishes `dicebear/core` from that mirror. All three ports ride
the same version the monorepo tagged.

## Licensing

By opening a pull request you agree that your contribution is released under the
repository's [MIT license](./LICENSE). Avatar style artwork in `dicebear/styles`
may carry other licenses; see that repo's `LICENSE.md` for details.
