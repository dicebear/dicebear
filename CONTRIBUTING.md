# Contributing

Thanks for your interest in contributing to DiceBear.

This is the main monorepo: the JavaScript, PHP, Python, Rust, Go, Dart, and C#
core libraries, the CLI, the docs site, and the editor all live here.
Repositories covering the JSON Schema, the avatar style definitions, the HTTP
API, and DiceBear Studio (the Figma plugin) are separate and each have their own
`CONTRIBUTING.md`:

- [`dicebear/schema`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md):
  JSON Schema for definitions and options
- [`dicebear/styles`](https://github.com/dicebear/styles/blob/main/CONTRIBUTING.md):
  Official avatar style definitions
- [`dicebear/api`](https://github.com/dicebear/api/blob/main/CONTRIBUTING.md):
  Self-hostable HTTP API
- [`dicebear/studio`](https://github.com/dicebear/studio/blob/main/CONTRIBUTING.md):
  DiceBear Studio (Figma plugin)

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
- For Python work: Python 3.10+ (CI runs on 3.10 to 3.14); install the package
  in a virtualenv with `pip install -e ".[dev]"` inside `src/python/core/`
- For Rust work: Rust 1.80+ with the `clippy` and `rustfmt` components; build
  and test with `cargo test`, `cargo clippy`, and `cargo fmt` inside
  `src/rust/core/`
- For Go work: Go 1.23+ (CI runs on 1.23 to 1.25); test with `go test ./...` and
  check with `gofmt -l .` and `go vet ./...` inside `src/go/core/`
- For Dart work: Dart SDK 3.4+ (CI runs on 3.4 and stable); test with
  `dart test` and check with `dart format --output=none --set-exit-if-changed .`
  and `dart analyze --fatal-infos` inside `src/dart/core/`
- For C# work: the .NET SDK 8.0+ (CI runs on 8.0). Build with
  `dotnet build DiceBear.Core.csproj` and test with
  `dotnet test tests/DiceBear.Core.Tests.csproj` inside `src/csharp/core/`.
  Warnings are errors, so the build fails on an unused variable or a missing XML
  doc comment.

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
├── python/          # Python port (PyPI package `dicebear-core`)
├── rust/            # Rust port (crates.io crate `dicebear-core`)
├── go/              # Go port (module `github.com/dicebear/dicebear-go/v10`)
├── dart/            # Dart port (pub.dev package `dicebear_core`)
└── csharp/          # C# port (NuGet package `DiceBear.Core`)
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
package (the Python counterpart of `@dicebear/schema` / `dicebear/schema`),
which `pip install -e ".[dev]"` pulls in as a runtime dependency. Nothing is
vendored.

### Rust core (`src/rust/core/`)

```sh
cd src/rust/core
cargo test
cargo clippy --all-targets --all-features -- -D warnings
cargo fmt --check
```

The Rust core reads the two draft-07 schemas from the `dicebear-schema` crate
(the Rust counterpart of `@dicebear/schema` / `dicebear/schema`) as a runtime
dependency. Nothing is vendored.

### Go core (`src/go/core/`)

```sh
cd src/go/core
go test ./...
go vet ./...
gofmt -l .   # prints nothing when formatting is correct
```

The Go core reads the two draft-07 schemas from the `github.com/dicebear/schema`
module (the Go counterpart of `@dicebear/schema` / `dicebear/schema`) as a
dependency. Nothing is vendored. Style definitions come from
`github.com/dicebear/styles/v10`. The module path carries the major version
(`/v10`), so a major bump changes the path by hand; `scripts/version.mjs` only
creates the Git tag the module proxy reads.

### Dart core (`src/dart/core/`)

```sh
cd src/dart/core
dart pub get
dart test
dart analyze --fatal-infos
dart format --output=none --set-exit-if-changed .
```

The Dart core reads the two draft-07 schemas from the `dicebear_schema` package
(the Dart counterpart of `@dicebear/schema` / `dicebear/schema`) as a runtime
dependency, validated with `package:json_schema`. Nothing is vendored.

`src/dart/core/CHANGELOG.md` is a git-ignored build artifact: pub.dev expects a
changelog inside the package directory, so the CI workflows copy the repository
root `CHANGELOG.md` there before `dart pub publish [--dry-run]`. This follows
the same pattern as the generated `LICENSE` copies in the styles and schema
repositories. Maintain the root changelog only.

### C# core (`src/csharp/core/`)

```sh
cd src/csharp/core
dotnet build DiceBear.Core.csproj
dotnet test tests/DiceBear.Core.Tests.csproj
dotnet format DiceBear.Core.csproj --verify-no-changes
dotnet format tests/DiceBear.Core.Tests.csproj --verify-no-changes
```

There is no solution file, so the project is named explicitly. The library
multi-targets `netstandard2.0` and `net8.0`, so it also runs in Godot 4.2+ with
.NET, in Unity, and on .NET Framework. The test project targets `net8.0` only,
which is why building the library on its own is a separate step: a net8.0 test
project pulls in only the net8.0 build of what it references.

The C# core reads the two draft-07 schemas from the `DiceBear.Schema` package
(the NuGet counterpart of `@dicebear/schema` / `dicebear/schema`) as a runtime
dependency, validated with `JsonSchema.Net`. Nothing is vendored.

Two generated tables live in `src/csharp/core/src/Utils/`. `Color.cs` carries
the shared 256-entry sRGB linearization table, and `Uppercase.cs` carries the
full JavaScript uppercase mapping, which the initials feature needs because the
invariant culture only applies simple case mappings. Both files document how to
regenerate them.

### Cross-language parity

Every port must produce output **byte-identical** to the reference JavaScript
core (`@dicebear/core`) for the same inputs. A shared fixture suite in
`tests/fixtures/parity/` (generated from the JS reference) enforces this, and
each side consumes it:

- JS side: `src/js/core/tests/Parity.test.js`, run via
  `npm run test --workspace @dicebear/core`.
- PHP side: `tests/ParityTest.php`, run via `vendor/bin/phpunit` in
  `src/php/core/`.
- Python side: `tests/test_parity.py`, run via `pytest` in `src/python/core/`.
- Rust side: the module unit tests plus `tests/avatars.rs`, run via `cargo test`
  in `src/rust/core/`.
- Go side: the in-package tests (`parity_test.go`, `avatars_test.go`), run via
  `go test ./...` in `src/go/core/`.
- Dart side: the tests under `test/parity/`, run via `dart test` in
  `src/dart/core/`.
- C# side: `tests/PrimitiveParityTests.cs`, `tests/AvatarParityTests.cs` and
  `tests/ValidationParityTests.cs`, run via
  `dotnet test tests/DiceBear.Core.Tests.csproj` in `src/csharp/core/`.

The fixtures cover `Fnv1a` (hash + hex), `Mulberry32` (chained sequences), every
`Prng` method, number-to-string formatting (`numbers.json`, the `formatNumber`
contract: every emitted number rounded to at most 5 decimal places, which every
port must reproduce identically), initials extraction, the `Color` helpers
(including bit-exact luminance doubles), accept/reject validation outcomes plus
circular color-reference chains, the `OptionsDescriptor` field map, and full
`Avatar.toString()` (plus selected `toDataUri()`) output for the `initials`,
`thumbs`, `glass`, `notionists`, and `shape-grid` styles. That last bucket
covers seed, size, transforms, gradients, `title` escaping, and
component-variant overrides.

Float determinism is part of the parity contract: `pow` is not correctly rounded
(JS engines, libm, and Go all differ in the last bit), so the sRGB linearization
ships as a precomputed 256-entry table in every port, and languages that fuse
multiply-add into FMA instructions (e.g. Go on arm64) must force intermediate
rounding. The details live in the
[Implement DiceBear Core](https://www.dicebear.com/specification/implement-dicebear-core/)
spec.

If your change affects rendering or the PRNG in `@dicebear/core`, regenerate the
fixtures from the JS reference and commit the diff:

```sh
npm run fixtures:parity
```

The PHP, Python, Rust, Go, Dart, and C# suites will then fail loudly until those
sides are brought back in sync. That is the intended signal. If you only intend
to touch one language, expect to update both before your PR can be merged.

The script has a second input: it vendors the five real style definitions from
the sibling `styles` repo. If those moved since the last sync it stops without
writing anything, because the avatar fixtures render against them and a styles
bump would otherwise ride along inside an unrelated diff. When the styles update
is the point, re-run it as `npm run fixtures:parity -- --update-styles` and
commit that bump on its own.

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
- Rust code is formatted with `rustfmt` and linted with Clippy (warnings
  denied); run `cargo fmt` and
  `cargo clippy --all-targets --all-features -- -D warnings` in `src/rust/core/`
  before you open a PR.
- Go code is formatted with `gofmt` and vetted with `go vet`; run `gofmt -w .`
  and `go vet ./...` in `src/go/core/` before you open a PR.
- Dart code is formatted with `dart format` and analyzed with
  `dart analyze --fatal-infos` (lints from `analysis_options.yaml`); run both in
  `src/dart/core/` before you open a PR.
- C# code is formatted with `dotnet format` and builds with warnings as errors.
  Run both against `DiceBear.Core.csproj` and `tests/DiceBear.Core.Tests.csproj`
  in `src/csharp/core/` before you open a PR. The four-space indent comes from
  the `[*.cs]` section of the repository `.editorconfig`.

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
3. Update `version` in `src/python/core/pyproject.toml`,
   `src/rust/core/Cargo.toml`, `src/dart/core/pubspec.yaml`, and
   `src/csharp/core/DiceBear.Core.csproj` (the Python, Rust, Dart, and C# cores
   are not npm workspaces, so they are bumped explicitly to stay in lockstep)
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
   publishing (the `publish-python` job): no token and no separate repository,
   the same way the npm packages go out
6. Publishes the Rust core `dicebear-core` to crates.io via trusted publishing
   (the `publish-rust` job): likewise no token; `cargo publish` builds and
   uploads `src/rust/core` in one step
7. Publishes the Dart core `dicebear_core` to pub.dev via automated publishing
   (the `publish-pub` job): likewise no token; pub.dev verifies the `v<version>`
   tag against the pubspec version and publishes `src/dart/core` straight from
   the monorepo
8. Publishes the C# core `DiceBear.Core` to NuGet via trusted publishing (the
   `publish-nuget` job): likewise no token. `dotnet pack` and
   `dotnet nuget push` upload `src/csharp/core` in one step

The PHP port is the exception: Composer/Packagist consumes one Git repository
per package rather than a monorepo subdirectory, so `split-php-core.yml` mirrors
`src/php/core` (tags included) to the standalone
[`dicebear/dicebear-php`](https://github.com/dicebear/dicebear-php) repository,
and Packagist publishes `dicebear/core` from that mirror. All six ports ride the
same version the monorepo tagged.

## Licensing

By opening a pull request you agree that your contribution is released under the
repository's [MIT license](./LICENSE). Avatar style artwork in `dicebear/styles`
may carry other licenses; see that repo's `LICENSE.md` for details.
