---
title: Contribute to the Library | DiceBear
description: >
  Learn how to contribute an avatar style, improve an existing one, or
  contribute to the DiceBear core packages.
---

# Contribute to the library

There are several ways you can contribute to this project. You can contribute an
avatar style or improve an existing one. Or you add tests or update the
[documentation](/guides/contribute-to-the-documentation/).

## Requirements

- A GitHub account
- Git installed (Learn how to install Git
  [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- Node.js and NPM installed (Learn how to install Node.js
  [here](https://nodejs.org/en/download/))

## Set up project locally

1. [Create a fork](https://help.github.com/en/articles/fork-a-repo) from the
   [dicebear/dicebear](https://github.com/dicebear/dicebear) repository.

2. Clone the project:

   ```
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/dicebear.git
   ```

   If you've set up SSH, you can do this instead:

   ```
   git clone git@github.com:<YOUR_GITHUB_USERNAME>/dicebear.git
   ```

3. Install dependencies:

   ```
   cd dicebear
   npm install
   ```

4. Create a build:

   ```
   npm run build
   ```

## Contributing an avatar style

The [Figma Exporter](/guides/create-an-avatar-style-with-figma/) plugin is the
easiest way to add an avatar style. Most avatar styles for DiceBear avatars were
created this way. Alternatively, you can create an avatar style
[from scratch](/guides/create-an-avatar-style-from-scratch/).

Avatar styles are maintained in the following repository:
[dicebear/definitions](https://github.com/dicebear/definitions).

To contribute a new style or improve an existing one, please open an issue or
pull request there.

Place your avatar style in the following path:

```
src/<avatar-style>.json
```

### Verifying your changes

You can test your new avatar style as follows:

```
npm install
npm run build
npm run test
```

The test creates multiple avatars under the path `tests/svg/<avatar-style>` and
checks that the result has not changed when the test is called again. It should
not change because the creation with seed must be deterministic.

If you visually check the created avatars and find errors, you can correct your
work and run the build and test again. But first delete the files in the
directory.

### Branching and committing

Once you are happy with the changes, create a branch so you can commit the
changes.

```
git checkout -b <YOUR_AVATAR_STYLE_NAME>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Add: <YOUR_AVATAR_STYLE_NAME>"
git push origin <YOUR_AVATAR_STYLE_NAME>
```

### Creating a Pull Request

Follow
[these instructions](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
to create a Pull Request.

## Contribute changes to an existing avatar style

Usually the official avatar styles were created with our
[Figma Exporter](/guides/create-an-avatar-style-with-figma/) plugin. You can
find the Figma source files in the `figma` folder of the
[dicebear/definitions](https://github.com/dicebear/definitions) repository. So
if you want to customize an avatar style, it's best to do the customization
directly in Figma.

In order to edit the files in Figma, you must
[duplicate](https://help.figma.com/hc/en-us/articles/360038511533-Duplicate-files)
them. Otherwise, the steps are identical to those in
[Contributing an avatar style](#contributing-an-avatar-style) with the
difference that you are working on an existing avatar style.

## Contribute to a package

You want to contribute to a package, like `@dicebear/core` or the official CLI?
All packages are written in [TypeScript](https://www.typescriptlang.org/) and
you can find them in the `src/js` folder.

### Verifying your changes

You can test your changes as follows:

```
npm install
npm run build --workspace <PACKAGE_NAME>
npm run test --workspace <PACKAGE_NAME>
```

If you are working on the CLI, you can test your changes _after_ the build by
calling the CLI script directly as follows:

```
node src/js/cli/bin/index.js <COMMAND>
```

<!-- The Branching and committing / Creating a Pull Request steps below intentionally parallel the style-contributor sections above. The branch and commit placeholders differ (generic <YOUR_BRANCH> / "Change:" prefix vs. style-specific), so both variants are kept for clarity. Update both if changing. -->

### Branching and committing

Once you are happy with the changes, create a branch so you can commit the
changes.

```
git checkout -b <YOUR_BRANCH>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Change: <YOUR_CHANGES>"
git push origin <YOUR_BRANCH>
```

### Creating a Pull Request

See
[Creating a Pull Request](#creating-a-pull-request) above for instructions.

## Releasing new versions (maintainers only)

::: info  
Only maintainers with write access to the repository can release new versions.
This section is documented here for completeness.  
:::

Releases are triggered by Git tags. The version script updates all package
versions across the monorepo, creates a commit and a Git tag:

```
node scripts/version.mjs <version>
```

The version must be a valid [semver](https://semver.org/) version (e.g. `9.1.0`
or `9.2.0-alpha.1`). The script will:

1. Update the version in all `package.json` files across the workspace
2. Update internal workspace dependency references
3. Sync `package-lock.json`
4. Create a Git commit and tag (e.g. `v9.1.0`)

Afterwards, push the commit and tag to the remote:

```
git push && git push --tags
```

The Git tag triggers the
[Publish](https://github.com/dicebear/dicebear/actions/workflows/publish.yml)
GitHub Actions workflow, which:

1. Runs the test suite on Node 20, 22, 24, and 25
2. Builds all packages
3. Determines the npm dist-tag:
   - Tags containing `alpha`, `beta`, or `rc` are published as `next`
   - All other tags are published as `latest` (configurable via the `.dist-tag`
     file)
4. Publishes all changed packages to npm
